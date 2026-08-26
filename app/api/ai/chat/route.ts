import { authOptions } from "@/lib/auth";
import { MAX_HISTORY_MESSAGE_CHARS } from "@/lib/constants/chat";
import { client } from "@/lib/prisma";
import { generateAnswer, generateQueryEmbedding } from "@/utils/gemini";
import { similaritySearch } from "@/utils/rag";
import { checkRateLimit } from "@/utils/rate-limit";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const allowed = await checkRateLimit(session.user.id);
	if (!allowed) {
		return NextResponse.json(
			{ error: "You're sending messages too quickly. Please slow down." },
			{ status: 429 },
		);
	}

	const { chatId, preferences } = await req.json();

	// Ownership check — make sure this chat belongs to the requesting user
	const chat = await client.chat.findUnique({
		where: { id: chatId },
		select: { documentId: true, userId: true },
	});

	if (!chat) {
		return NextResponse.json({ error: "Chat not found" }, { status: 404 });
	}
	if (chat.userId !== session.user.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
	}

	let messages;
	try {
		messages = await client.message.findMany({
			where: { chatId },
			orderBy: { createdAt: "desc" },
			take: 6,
		});
	} catch (error) {
		console.error("Error fetching messages");
		return NextResponse.json(
			{ error: "Error fetching messages" },
			{ status: 500 },
		);
	}

	// Guard against empty history
	if (!messages.length) {
		return NextResponse.json(
			{ error: "No messages found for this chat" },
			{ status: 400 },
		);
	}

	let context = "";
	const latestMessage = messages[0];

	if (chat.documentId) {
		const queryEmbedding = await generateQueryEmbedding(latestMessage.content);
		const results = await similaritySearch(queryEmbedding, chat.documentId, 5);

		context = results
			.filter((r) => r.similarity > 0.5)
			.map((r) =>
				r.page != null ? `[Page ${r.page}]\n${r.content}` : r.content,
			)
			.join("\n\n");
	}

	const formattedMessages: {
		role: "user" | "model";
		parts: { text: string }[];
	}[] = messages
		.slice(1)
		.reverse()
		.map((message) => ({
			role: message.role === "USER" ? "user" : "model",
			parts: [
				{
					text:
						message.content.length > MAX_HISTORY_MESSAGE_CHARS
							? message.content.slice(0, MAX_HISTORY_MESSAGE_CHARS) +
								"\n\n[...truncated]"
							: message.content,
				},
			],
		}));

	const response = await generateAnswer(
		latestMessage.content,
		context,
		formattedMessages,
		preferences,
	);

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of response) {
					controller.enqueue(encoder.encode(chunk.text ?? ""));
				}
				controller.close();
			} catch (error) {
				console.error("Stream error:", error);
				controller.error(error);
			}
		},
	});

	return new Response(stream, {
		headers: { "Content-Type": "text/plain" },
	});
}
