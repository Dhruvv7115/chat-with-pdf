import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { deleteFile, detectFileType, getFileBufferFromS3, getFileUrl, uploadFile } from "@/utils/s3";
import { client } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

// Helper function to get PDFs uploaded this month
async function getPdfsUploadedThisMonth(userId: string) {
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const count = await client.document.count({
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
async function canUploadPdf(userId: string): Promise<{
	canUpload: boolean;
	uploaded: number;
	limit: number;
	pro: boolean;
}> {
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

	saveDoc: protectedProcedure
		.input(
			z.object({
				key: z.string(),
				title: z.string(),
				fileType: z.enum(["PDF", "DOCX", "MARKDOWN", "TXT", "IMAGE"]),
				fileSize: z.number().optional(),
				pageCount: z.number().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const {
				key,
				title,
				fileType: clientFileType,
				fileSize,
				pageCount,
			} = input;

			const { canUpload, uploaded, limit } = await canUploadPdf(ctx.userId);
			if (!canUpload) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Hobby plan limit reached. You've uploaded ${uploaded}/${limit} PDFs this month. Upgrade to Pro for unlimited uploads.`,
				});
			}

			// Fetch the actual bytes from S3 to verify real file type
			const buffer = await getFileBufferFromS3(key); // your existing S3 fetch util, or write one
			const detectedFileType = await detectFileType(buffer); // the formatFromBytes wrapper from before

			if (!detectedFileType) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"Could not determine file type — the file may be corrupted or unsupported.",
				});
			}

			// Optional: warn/log if client and server disagree, but trust the server's detection
			if (detectedFileType !== clientFileType) {
				console.warn(
					`fileType mismatch for ${key}: client said ${clientFileType}, detected ${detectedFileType}`,
				);
			}

			const doc = await client.document.create({
				data: {
					fileKey: key,
					title,
					userId: ctx.userId,
					fileType: detectedFileType, // trust the server-verified value, not the client's
					fileSize,
					pageCount,
				},
			});
			return doc;
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
			await client.document.delete({ where: { fileKey: input.key } });
		}),

	// Get recent user documents (limited)
	getUserDocs: protectedProcedure.query(async ({ ctx }) => {
		return client.document.findMany({
			where: { userId: ctx.userId },
			orderBy: { createdAt: "desc" },
			take: 3,
		});
	}),
	getUserPdfs: protectedProcedure.query(async ({ ctx }) => {
		return client.document.findMany({
			where: { userId: ctx.userId },
			orderBy: { createdAt: "desc" },
			take: 3,
		});
	}),

	// Get all user's documents with presigned S3 URLs
	getAllUserDocsWithUrls: protectedProcedure.query(async ({ ctx }) => {
		const docs = await client.document.findMany({
			where: { userId: ctx.userId },
			orderBy: { createdAt: "desc" },
		});

		const docsWithUrls = await Promise.all(
			docs.map(async (doc) => {
				let url = "";
				try {
					url = await getFileUrl(doc.fileKey);
				} catch (err) {
					console.error(
						"Error generating presigned URL for key:",
						doc.fileKey,
						err,
					);
				}
				return {
					...doc,
					url,
				};
			}),
		);

		return docsWithUrls;
	}),
	getAllUserPdfsWithUrls: protectedProcedure.query(async ({ ctx }) => {
		const pdfs = await client.document.findMany({
			where: { userId: ctx.userId },
			orderBy: { createdAt: "desc" },
		});

		const pdfsWithUrls = await Promise.all(
			pdfs.map(async (pdf) => {
				let url = "";
				try {
					url = await getFileUrl(pdf.fileKey);
				} catch (err) {
					console.error(
						"Error generating presigned URL for key:",
						pdf.fileKey,
						err,
					);
				}
				return {
					...pdf,
					url,
				};
			}),
		);

		return pdfsWithUrls;
	}),
});
