import { authOptions } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { indexDocument } from "@/utils/pdf-loader";
import { checkRateLimit } from "@/utils/rate-limit";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const allowed = await checkRateLimit(session.user.id);
	if (!allowed) {
		return NextResponse.json(
			{ error: "You're sending messages too quickly. Please slow down." },
			{ status: 429 },
		);
	}
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
		if (doc.userId !== session.user.id) {
			return NextResponse.json(
				{ error: "Unauthorized to access this document" },
				{ status: 403 },
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
