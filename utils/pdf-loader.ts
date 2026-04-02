import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateEmbedding, summarizePdf } from "./gemini";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { client } from "@/lib/prisma";
import cuid from "cuid";

export async function loadPdfText(pdfUrl: string) {
	const response = await fetch(pdfUrl);
	const arrayBuffer = await response.arrayBuffer();
	const blob = new Blob([arrayBuffer], { type: "application/pdf" });
	const loader = new PDFLoader(blob);
	const pdf = await loader.load();
	return pdf;
}

export async function indexPdf(pdfUrl: string, pdfId: string) {
	const docs = await loadPdfText(pdfUrl);
	const content = docs
		.map((doc, index) => `--- PAGE ${index + 1} ---\n${doc.pageContent}`)
		.join("\n\n");

	const contentForChunking = docs.map((doc) => doc.pageContent).join("\n\n");
	const chunks = await chunkPdf(contentForChunking);

	// We are batching the chunks so that we dont hit the api rate limits, for now a batch of 5 (a single batch would execute parallely -> 5 chunks)
	const batches: string[][] = [];
	chunks.forEach((chunk, index) => {
		const batchIndex = Math.floor(index / 5);
		if (!batches[batchIndex]) {
			batches[batchIndex] = [];
		}
		batches[batchIndex].push(chunk);
	});

	const allEmbeddings = [];
	for (const batch of batches) {
		console.log("generating embeddings for batch:", batches.indexOf(batch));
		const batchEmbeddings = await Promise.all(
			batch.map((chunk) => generateEmbedding(chunk)),
		);
		for (let i = 0; i < batch.length; i++) {
			try {
				const embedding = await client.pdfEmbedding.create({
					data: {
						id: cuid(),
						pdfId,
						content: batch[i],
					},
				});
				const vectorString = `[${batchEmbeddings[i].join(",")}]`;

				await client.$executeRaw`
					UPDATE "PdfEmbedding"
					SET embedding = ${vectorString}::vector
					WHERE id = ${embedding.id}
				`;
			} catch (error) {
				console.log("error:", error);
				throw new Error("Error indexing PDF");
			}
		}
		allEmbeddings.push(...batchEmbeddings);
	}

	return summarizePdf(content);
}

export async function chunkPdf(document: string) {
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});
	const texts = await splitter.splitText(document);
	return texts;
}