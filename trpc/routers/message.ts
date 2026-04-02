import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { client } from "@/lib/prisma";
import { indexPdf } from "@/utils/pdf-loader";
import { api } from "../client";
import { generateAnswer, generateQueryEmbedding } from "@/utils/gemini";
import { similaritySearch } from "@/utils/rag";

export const messageRouter = createTRPCRouter({

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
