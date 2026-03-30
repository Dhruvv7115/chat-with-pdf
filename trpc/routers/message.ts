import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { client } from "@/lib/prisma";
import { indexPdf } from "@/utils/pdf-loader";
import { api } from "../client";
import { generateAnswer, generateQueryEmbedding } from "@/utils/gemini";
import { similaritySearch } from "@/utils/rag";

export const messageRouter = createTRPCRouter({
	createAiSummary: protectedProcedure
		.input(
			z.object({
				pdfId: z.string(),
				pdfUrl: z.string(),
			}),
		)
		.subscription(async function* ({ input, ctx }) {
			const { pdfId, pdfUrl } = input;
			const existing = await client.pdfEmbedding.findFirst({
				where: { pdfId },
			});
			if (existing) {
				// optionally just stream a summary without re-indexing, or even return early
				// for now you could just return without calling indexPdf
				return;
			}

			for await (const chunk of indexPdf(pdfUrl, pdfId)) {
				yield chunk;
			}
		}),

	createMessage: protectedProcedure
		.input(
			z.object({
				chatId: z.string(),
				content: z.string(),
				role: z.enum(["USER", "ASSISTANT"]),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { chatId, content, role } = input;
			const message = await client.message.create({
				data: {
					content,
					chatId,
					role,
				},
			});

			return message;
		}),
});
