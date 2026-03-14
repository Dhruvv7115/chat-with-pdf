import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { deleteFile, getFileUrl, uploadFile } from "@/utils/s3";
import { client } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

export const pdfRouter = createTRPCRouter({
	// Get pre-signed upload URL
	getUploadUrl: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				type: z.string(),
				size: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { url, key } = await uploadFile(ctx.userId, input);
			return { url, key };
		}),

	savePdf: protectedProcedure
		.input(
			z.object({
				key: z.string(),
				title: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { key, title } = input;
			const pdf = await client.pdf.create({
				data: {
					fileKey: key,
					title,
					userId: ctx.userId,
				},
			});
			return pdf;
		}),

	// Get file URL
	getFileUrl: protectedProcedure
		.input(z.object({ key: z.string() }))
		.query(async ({ input, ctx }) => {
			if (!input.key.startsWith(`users/${ctx.userId}/`)) {
				throw new TRPCError({ code: "UNAUTHORIZED" });
			}
			const url = await getFileUrl(input.key);
			return { url };
		}),

	// Delete file
	deleteFile: protectedProcedure
		.input(z.object({ key: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (!input.key.startsWith(`users/${ctx.userId}/`)) {
				throw new TRPCError({ code: "UNAUTHORIZED" });
			}
			await deleteFile(input.key);
			await client.pdf.delete({ where: { fileKey: input.key } });
		}),

	// Get all user's PDFs
	getUserPdfs: protectedProcedure.query(async ({ ctx }) => {
		return client.pdf.findMany({
			where: { userId: ctx.userId },
			orderBy: { createdAt: "desc" },
		});
	}),
});
