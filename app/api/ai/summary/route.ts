import { client } from "@/lib/prisma";
import { indexPdf } from "@/utils/pdf-loader";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const { pdfId, pdfUrl } = await req.json();
	const existing = await client.pdfEmbedding.findFirst({
		where: { pdfId },
	});
	if (existing) {
		// optionally just stream a summary without re-indexing, or even return early
		// for now you could just return without calling indexPdf
		return new Response("", { status: 200 });
	}
	const summary = await indexPdf(pdfUrl, pdfId);

	const stream = new ReadableStream({
		async start(controller) {
			for await (const chunk of summary) {
				controller.enqueue(chunk.text);
			}
			controller.close();
		},
	});

	return new Response(stream, {
		headers: { "Content-Type": "text/plain" },
	});
}
