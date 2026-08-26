import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateEmbedding, summarizeDocument } from "./gemini";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { client } from "@/lib/prisma";
import { toMarkdownBytes } from "@firecrawl/anydoc";
import { FileType } from "@/lib/generated/prisma/enums";
import { MAX_PDF_CHARS } from "@/lib/constants/chat";

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
	let pageChunks: { content: string; page: number | null }[] = [];
	let content: string;

	if (docType === FileType.PDF) {
		const docs = await loadPdfText(docUrl);
		const size = docs.reduce((acc, doc) => acc + doc.pageContent.length, 0);
		console.log(
			"docs loaded with",
			docs.length,
			"pages and",
			size,
			"characters",
		);

		if (size > MAX_PDF_CHARS) {
			throw new Error(
				"PDF contains too much text. Please upload a shorter document.",
			);
		}
		if (docs.length === 0) {
			throw new Error("No pages found in the PDF document.");
		} 
		content = docs
			.map((doc, index) => `--- PAGE ${index + 1} ---\n${doc.pageContent}`)
			.join("\n\n");
		for (let i = 0; i < docs.length; i++) {
			const splitter = new RecursiveCharacterTextSplitter({
				chunkSize: 1000,
				chunkOverlap: 100,
			});
			const pageTexts = await splitter.splitText(docs[i].pageContent);
			pageTexts.forEach((text) =>
				pageChunks.push({ content: text, page: i + 1 }),
			);
		}
	} else {
		const markdown = await extractText(docUrl, docType);
		content = markdown;
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 100,
		});
		const texts = await splitter.splitText(markdown);
		pageChunks = texts.map((text) => ({ content: text, page: null }));
	}

	const batches: { content: string; page: number | null }[][] = [];
	pageChunks.forEach((chunk, index) => {
		const batchIndex = Math.floor(index / 5);
		if (!batches[batchIndex]) batches[batchIndex] = [];
		batches[batchIndex].push(chunk);
	});

	for (const batch of batches) {
		console.log("generating embeddings for batch:", batches.indexOf(batch));
		const batchEmbeddings = await Promise.all(
			batch.map((c) => generateEmbedding(c.content)),
		);
		for (let i = 0; i < batch.length; i++) {
			try {
				const embedding = await client.documentEmbedding.create({
					data: {
						documentId: docId,
						content: batch[i].content,
						page: batch[i].page, // new column
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
	}

	return summarizeDocument(content);
}
