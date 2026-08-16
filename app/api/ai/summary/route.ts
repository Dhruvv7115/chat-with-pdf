import { client } from "@/lib/prisma";
import { indexDocument } from "@/utils/pdf-loader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	let body;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	const { documentId, docUrl } = body;
	if (!documentId || !docUrl) {
		return NextResponse.json(
			{ error: "Missing documentId or docUrl" },
			{ status: 400 },
		);
	}

	try {
		const doc = await client.document.findUnique({ where: { id: documentId } });
		if (!doc) {
			return NextResponse.json(
				{ error: "Document not found" },
				{ status: 404 },
			);
		}

		const response = await indexDocument(docUrl, documentId, doc.fileType);

		const stream = new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of response) {
						controller.enqueue(chunk.text);
					}
					controller.close();
				} catch (err) {
					console.error("Stream error:", err);
					controller.error(err); // propagates failure to the client's reader
				}
			},
		});
		return new Response(stream, { headers: { "Content-Type": "text/plain" } });
	} catch (error: any) {
		console.error("Error indexing document:", error);
		return NextResponse.json(
			{ error: "Failed to process document. Please try again." },
			{ status: 500 },
		);
	}
}
