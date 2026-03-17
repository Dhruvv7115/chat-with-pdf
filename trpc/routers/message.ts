import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { client } from "@/lib/prisma";
import { indexPdf } from "@/utils/pdf-loader";

export const messageRouter = createTRPCRouter({
	createAiSummary: protectedProcedure
		.input(
			z.object({
				chatId: z.string(),
				pdfUrl: z.string(),
			}),
		)
		.subscription(async function* ({ input, ctx }) {
			const { chatId, pdfUrl } = input;

			for await (const chunk of indexPdf(pdfUrl, chatId)) {
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
