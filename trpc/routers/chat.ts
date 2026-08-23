import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { client } from "@/lib/prisma";

export const chatRouter = createTRPCRouter({
	createChat: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				docId: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { title, docId } = input;
			const chat = await client.chat.create({
				data: {
					title,
					documentId: docId,
					userId: ctx.userId,
				},
			});
			return chat;
		}),
	getOrCreateChat: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				docId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { title, docId } = input;
			const existingChat = await client.chat.findFirst({
				where: {
					documentId: docId,
					userId: ctx.userId,
				},
				orderBy: { createdAt: "desc" },
			});
			if (existingChat) {
				return existingChat;
			}
			const newChat = await client.chat.create({
				data: {
					title,
					documentId: docId,
					userId: ctx.userId,
				},
			});
			return newChat;
		}),
	getChats: protectedProcedure.query(async ({ ctx, input }) => {
		return client.chat.findMany({
			where: { userId: ctx.userId },
			orderBy: { createdAt: "desc" },
		});
	}),
	getAllUserChats: protectedProcedure.query(async ({ ctx }) => {
		return client.chat.findMany({
			where: { userId: ctx.userId },
			orderBy: { updatedAt: "desc" },
			include: {
				document: {
					select: {
						id: true,
						title: true,
						fileType: true,
					},
				},
				_count: {
					select: {
						messages: true,
					},
				},
			},
		});
	}),
	getUserChats: protectedProcedure
		.input(z.object({ limit: z.number() }))
		.query(async ({ ctx, input }) => {
			const { limit } = input;
			return client.chat.findMany({
				where: { userId: ctx.userId },
				orderBy: { createdAt: "desc" },
				take: limit,
				select: {
					id: true,
					title: true,
					createdAt: true,
				},
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
				cursor: z.string().optional(),
				limit: z.number().min(1).max(50).default(20),
			}),
		)
		.query(async ({ input }) => {
			const { chatId, cursor, limit } = input;

			const messages = await client.message.findMany({
				where: { chatId },
				orderBy: { createdAt: "desc" },
				take: limit + 1,
				...(cursor && {
					cursor: { id: cursor },
				}),
			});

			let nextCursor: string | undefined;

			if (messages.length > limit) {
				const nextItem = messages.pop();
				nextCursor = nextItem!.id;
			}

			return {
				messages: messages.reverse(),
				nextCursor,
			};
		}),
});
