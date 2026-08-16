import { toMarkdownBytes } from "@firecrawl/anydoc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = req.nextUrl.searchParams.get("url");
	const fileType = req.nextUrl.searchParams.get("fileType");

	if (!url) {
		return NextResponse.json({ error: "Missing url" }, { status: 400 });
	}

	try {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const bytes = new Uint8Array(arrayBuffer);

		let markdown: string;

		if (fileType === "TXT" || fileType === "MARKDOWN") {
			markdown = new TextDecoder("utf-8").decode(bytes);
		} else {
			const formatMap: Record<string, string> = {
				PDF: "pdf",
				DOCX: "docx",
			};
			const formatHint = fileType ? formatMap[fileType] : undefined;
			// @ts-expect-error — anydoc's Format type is a const enum but accepts these string literal values at runtime
			markdown = await toMarkdownBytes(bytes, formatHint);
		}

		return NextResponse.json({ markdown });
	} catch (error: any) {
		console.error("Preview generation error:", error);
		return NextResponse.json({ error: error.message || "Failed to generate preview" }, { status: 500 });
	}
}