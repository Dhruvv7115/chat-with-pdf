import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { client } from "@/lib/prisma";

export const chatRouter = createTRPCRouter({
	createChat: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				pdfId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { title, pdfId } = input;
			const chat = await client.chat.create({
				data: {
					title,
					pdfId,
					userId: ctx.userId,
				},
			});
			return chat;
		}),
	getChats: protectedProcedure.query(async ({ ctx }) => {
		return client.chat.findMany({
			where: { userId: ctx.userId },
			orderBy: { createdAt: "desc" },
		});
	}),
	deleteChat: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id } = input;
			await client.chat.delete({ where: { id } });
		}),
	getMessages: protectedProcedure
		.input(
			z.object({
				chatId: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { chatId } = input;
			return client.message.findMany({
				where: { chatId },
				orderBy: { createdAt: "desc" },
			});
		}),
});
