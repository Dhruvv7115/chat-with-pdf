import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { deleteFile, getFileUrl, uploadFile } from "@/utils/s3";
import { client } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

// Helper function to get PDFs uploaded this month
async function getPdfsUploadedThisMonth(userId: string) {
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const count = await client.pdf.count({
		where: {
			userId,
			createdAt: {
				gte: startOfMonth,
			},
		},
	});

	return count;
}

// Helper function to check if user can upload more PDFs
async function canUploadPdf(
	userId: string,
): Promise<{ canUpload: boolean; uploaded: number; limit: number, pro: boolean }> {
	// Get user's subscription plan
	const subscription = await client.subscription.findUnique({
		where: { userId },
	});

	const plan = subscription?.plan || "FREE";
	const HOBBY_LIMIT = 5;
	const PRO_LIMIT = 10000; // No limit for Pro
	const TEAM_LIMIT = 10000; // No limit for Team

	const limit = plan === "FREE" ? HOBBY_LIMIT : PRO_LIMIT;

	if (plan !== "FREE") {
		return { canUpload: true, uploaded: 0, limit, pro: true };
	}

	const uploaded = await getPdfsUploadedThisMonth(userId);
	const canUpload = uploaded < HOBBY_LIMIT;

	return { canUpload, uploaded, limit, pro: plan !== "FREE" };
}

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

	// Check upload quota
	getUploadQuota: protectedProcedure.query(async ({ ctx }) => {
		return canUploadPdf(ctx.userId);
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

			// Check if user can upload
			const { canUpload, uploaded, limit } = await canUploadPdf(ctx.userId);

			if (!canUpload) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Hobby plan limit reached. You've uploaded ${uploaded}/${limit} PDFs this month. Upgrade to Pro for unlimited uploads.`,
				});
			}

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
			take: 3,
		});
	}),
});
