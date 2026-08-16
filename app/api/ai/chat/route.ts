import { authOptions } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { generateAnswer, generateQueryEmbedding } from "@/utils/gemini";
import { similaritySearch } from "@/utils/rag";
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
	const { chatId } = await req.json();
	let messages;
	try {
		messages = await client.message.findMany({
			where: { chatId },
			orderBy: { createdAt: "desc" },
			take: 4,
		});
	} catch (error) {
		console.error("Error fetching messages");
		throw new Error("Error fetching messages");
	}

	const chat = await client.chat.findUnique({
		where: { id: chatId },
		select: { documentId: true },
	});

	let context = "";

	// Only do retrieval if this chat actually has a linked document
	if (chat?.documentId) {
		const queryEmbedding = await generateQueryEmbedding(
			messages[messages.length - 1].content,
		);
		const results = await similaritySearch(queryEmbedding, chat.documentId, 5);

		context = results
			.filter((r) => r.similarity > 0.5)
			.map((r) => r.content)
			.join("\n\n");
	}

	const formattedMessages: {
		role: "user" | "model";
		parts: { text: string }[];
	}[] = messages
		.slice(0, messages.length - 1)
		.reverse()
		.map((message) => ({
			role: message.role === "USER" ? "user" : "model",
			parts: [{ text: message.content.slice(0, 200) + "..." }],
		}));

	const response = await generateAnswer(
		messages[messages.length - 1].content,
		context, // empty string for doc-less chats — generateAnswer needs to handle this gracefully
		formattedMessages,
	);

	const stream = new ReadableStream({
		async start(controller) {
			for await (const chunk of response) {
				controller.enqueue(chunk.text);
			}
			controller.close();
		},
	});
	return new Response(stream, {
		headers: { "Content-Type": "text/plain" },
	});
}

async function checkRateLimit(userId: string): Promise<boolean> {
	const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

	const recentCount = await client.message.count({
		where: {
			role: "USER",
			createdAt: { gte: oneMinuteAgo },
			chat: { userId },
		},
	});

	return recentCount < 10; // e.g. max 10 messages per minute
}
