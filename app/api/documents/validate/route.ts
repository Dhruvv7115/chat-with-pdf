import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { loadPdfText, extractText } from "@/utils/pdf-loader"; // whatever you named these
import { deleteFile, getFileUrl } from "@/utils/s3";
import { FileType } from "@/lib/generated/prisma/enums";
import { MAX_PDF_CHARS, MAX_PDF_PAGES } from "@/lib/constants/chat";

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { key, fileType } = await req.json();
	const docUrl = await getFileUrl(key);

	try {
		let totalChars = 0;
		let pageCount: number | null = null;

		if (fileType === FileType.PDF) {
			const docs = await loadPdfText(docUrl);
			pageCount = docs.length;
			totalChars = docs.reduce((sum, d) => sum + d.pageContent.length, 0);
		} else {
			const markdown = await extractText(docUrl, fileType);
			totalChars = markdown.length;
		}

		if (pageCount !== null && pageCount > MAX_PDF_PAGES) {
			await deleteFile(key).catch((e) => console.error("Cleanup failed:", e));
			return NextResponse.json(
				{
					ok: false,
					error: `Document has too many pages (${pageCount}, max ${MAX_PDF_PAGES}).`,
				},
				{ status: 200 },
			);
		}

		if (totalChars > MAX_PDF_CHARS) {
			await deleteFile(key).catch((e) => console.error("Cleanup failed:", e));
			return NextResponse.json(
				{
					ok: false,
					error: `Document is too long (${totalChars.toLocaleString()} characters, max ${MAX_PDF_CHARS.toLocaleString()}).`,
				},
				{ status: 200 },
			);
		}

		return NextResponse.json({ ok: true, pageCount, totalChars });
	} catch (error) {
		console.error("Document validation error:", error);
		await deleteFile(key).catch((e) => console.error("Cleanup failed:", e));
		return NextResponse.json(
			{
				ok: false,
				error:
					"Could not read this document. It may be corrupted or unsupported.",
			},
			{ status: 200 },
		);
	}
}
