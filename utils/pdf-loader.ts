import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateEmbedding, summarizeDocument } from "./gemini";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { client } from "@/lib/prisma";
import { toMarkdownBytes } from "@firecrawl/anydoc";
import { FileType } from "@/lib/generated/prisma/enums";

export async function loadPdfText(pdfUrl: string) {
	const response = await fetch(pdfUrl);
	const arrayBuffer = await response.arrayBuffer();
	const blob = new Blob([arrayBuffer], { type: "application/pdf" });
	const loader = new PDFLoader(blob);
	const pdf = await loader.load();
	return pdf;
}

export async function extractText(
	fileUrl: string,
	docType: FileType,
): Promise<string> {
	const response = await fetch(fileUrl);
	const arrayBuffer = await response.arrayBuffer();
	const bytes = new Uint8Array(arrayBuffer);

	if (docType === FileType.TXT || docType === FileType.MARKDOWN) {
		return new TextDecoder("utf-8").decode(bytes);
	}

	const formatMap: Record<string, string> = {
		[FileType.DOCX]: "docx",
		[FileType.CSV]: "csv", // needs its own enum value — see note below
	};
	const formatHint = formatMap[docType];
	// @ts-expect-error — anydoc's Format type is a const enum but accepts these string literal values at runtime
	const markdown = await toMarkdownBytes(bytes, formatHint);
	return markdown;
}

export async function indexDocument(
	docUrl: string,
	docId: string,
	docType: FileType,
) {
	let content: string;
	let contentForChunking: string;

	if (docType === FileType.PDF) {
		const docs = await loadPdfText(docUrl);
		content = docs
			.map((doc, index) => `--- PAGE ${index + 1} ---\n${doc.pageContent}`)
			.join("\n\n");
		contentForChunking = docs.map((doc) => doc.pageContent).join("\n\n");
	} else {
		const markdown = await extractText(docUrl, docType);
		content = markdown;
		contentForChunking = markdown;
	}

	const chunks = await chunkPdf(contentForChunking);

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
				const embedding = await client.documentEmbedding.create({
					data: {
						documentId: docId,
						content: batch[i],
					},
				});
				const vectorString = `[${batchEmbeddings[i].join(",")}]`;

				await client.$executeRaw`
					UPDATE "DocumentEmbedding"
					SET embedding = ${vectorString}::vector
					WHERE id = ${embedding.id}
				`;
			} catch (error) {
				console.log("error:", error);
				throw new Error("Error indexing document");
			}
		}
		allEmbeddings.push(...batchEmbeddings);
	}

	return summarizeDocument(content);
}

export async function chunkPdf(document: string) {
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});
	const texts = await splitter.splitText(document);
	return texts;
}
