import { client } from "@/lib/prisma";
import { generateAnswer, generateQueryEmbedding } from "@/utils/gemini";
import { similaritySearch } from "@/utils/rag";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const { chatId } = await req.json();
	let messages;
	try {
		messages = await client.message.findMany({
			where: { chatId },
			orderBy: { createdAt: "desc" },
			take: 4,
			include: {
				chat: {
					select: {
						pdfId: true,
					},
				},
			},
		});
		// console.log(messages);
	} catch (error) {
		console.error("Error fetching messages");
		throw new Error("Error fetching messages");
	}
	const queryEmbedding = await generateQueryEmbedding(
		messages[messages.length - 1].content,
	);
	// console.log("queryEmbedding:", queryEmbedding);
	const results = await similaritySearch(
		queryEmbedding,
		messages[0]?.chat?.pdfId ?? "",
		5,
	);
	// console.log("results:", results);

	const context = results
		.filter((r) => r.similarity > 0.5) // tune this threshold
		.map((r) => r.content)
		.join("\n\n");

	const formattedMessages: {
		role: "user" | "model";
		parts: {
			text: string;
		}[];
	}[] = messages
		.slice(0, messages.length - 1)
		.reverse()
		.map((message) => ({
			role: message.role === "USER" ? "user" : "model",
			parts: [{ text: message.content.slice(0, 200) + "..." }],
		}));

	console.log(formattedMessages);

	const response = await generateAnswer(
		messages[messages.length - 1].content,
		context,
		formattedMessages,
	);

	const stream = new ReadableStream({
		async start(controller) {
			// push chunks here
			// controller.enqueue("hello ");
			// controller.enqueue("world");
			// controller.close();
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
