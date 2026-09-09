import { authOptions } from "@/lib/auth";
import { MAX_HISTORY_MESSAGE_CHARS } from "@/constants/chat";
import { client } from "@/lib/prisma";
import { generateAnswer, generateQueryEmbedding } from "@/utils/gemini";
import { chatRequestSchema } from "@/lib/validation/chat";
import { similaritySearch } from "@/utils/rag";
import { checkRateLimit } from "@/utils/rate-limit";
import { type ModelMessage, type TextUIPart, type UIMessage } from "ai";
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

	const body = await req.json().catch(() => null);
	const parsedRequest = chatRequestSchema.safeParse(body);
	if (!parsedRequest.success) {
		return NextResponse.json(
			{ error: "Invalid chat request", details: parsedRequest.error.flatten() },
			{ status: 400 },
		);
	}

	const { chatId, preferences, messages: uiMessages } = parsedRequest.data;
	const latestUiMessage = uiMessages?.at(-1);
	const question = latestUiMessage?.parts
		.filter((part) => part.type === "text" && typeof part.text === "string")
		.map((part) => part.text as string)
		.join("")
		.trim();

	if (!latestUiMessage || latestUiMessage.role !== "user" || !question) {
		return NextResponse.json(
			{ error: "A user message is required" },
			{ status: 400 },
		);
	}

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

	// The UI SDK creates the user-message id. Persist that same id so a reload
	// restores the exact row currently displayed by the client.
	await client.message.upsert({
		where: { id: latestUiMessage.id },
		create: { id: latestUiMessage.id, chatId, content: question, role: "USER" },
		update: { content: question },
	});

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

	const formattedMessages: ModelMessage[] = messages
		.reverse()
		.map((message) => ({
			role:
				message.role === "USER" ? ("user" as const) : ("assistant" as const),
			content:
				message.content.length > MAX_HISTORY_MESSAGE_CHARS
					? message.content.slice(0, MAX_HISTORY_MESSAGE_CHARS) +
						"\n\n[...truncated]"
					: message.content,
		}));

	const assistantMessageId = crypto.randomUUID();
	const result = await generateAnswer({
		context,
		messages: formattedMessages,
		preferences,
	});

	return result.toUIMessageStreamResponse({
		originalMessages: uiMessages as UIMessage[],
		generateMessageId: () => assistantMessageId,
		onFinish: async ({ responseMessage, isAborted, outcome }) => {
			if (isAborted || outcome.status !== "completed") return;
			const content = responseMessage.parts
				.filter((part): part is TextUIPart => part.type === "text")
				.map((part) => part.text)
				.join("");
			if (!content) return;
			await client.message.upsert({
				where: { id: assistantMessageId },
				create: { id: assistantMessageId, chatId, content, role: "ASSISTANT" },
				update: { content },
			});
		},
		onError: (error) => {
			if (error == null) {
				return "unknown error";
			}

			if (typeof error === "string") {
				return error;
			}

			if (error instanceof Error) {
				return error.message;
			}

			return JSON.stringify(error);
		},
	});
}
