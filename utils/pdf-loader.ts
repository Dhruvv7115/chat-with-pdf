import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateEmbedding, summarizePdf } from "./gemini";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { client } from "@/lib/prisma";
import cuid from "cuid";

export async function loadPdfText(pdfUrl: string) {
	const response = await fetch(pdfUrl);
	// console.log("status:", response.status);
	// console.log("content-type:", response.headers.get("content-type"));
	const arrayBuffer = await response.arrayBuffer();
	const blob = new Blob([arrayBuffer], { type: "application/pdf" });
	const loader = new PDFLoader(blob);
	const pdf = await loader.load();
	return pdf;
}

export async function* indexPdf(pdfUrl: string, pdfId: string) {
	const docs = await loadPdfText(pdfUrl);
	const content = docs
		.map((doc, index) => `--- PAGE ${index + 1} ---\n${doc.pageContent}`)
		.join("\n\n");

	const contentForChunking = docs.map((doc) => doc.pageContent).join("\n\n");
	const chunks = await chunkPdf(contentForChunking);

	// We are batching the chunks so that we dont hit the api rate limits, for now a batch of 10 (a single batch would execute parallely -> 10 chunks)
	const batches: string[][] = [];
	chunks.forEach((chunk, index) => {
		const batchIndex = Math.floor(index / 10);
		if (!batches[batchIndex]) {
			batches[batchIndex] = [];
		}
		batches[batchIndex].push(chunk);
	});

	const allEmbeddings = [];
	for (const batch of batches) {
		const batchEmbeddings = await Promise.all(
			batch.map((chunk) => generateEmbedding(chunk)),
		);
		for (let i = 0; i < batch.length; i++) {
			await client.$executeRaw`
				INSERT INTO "PdfEmbedding" (id, "pdfId", content, embedding)
				VALUES (${cuid()}, ${pdfId}, ${batch[i]}, ${JSON.stringify(batchEmbeddings[i])}::vector)
			`;
		}
		allEmbeddings.push(...batchEmbeddings);
	}

	const response = await summarizePdf(content);
	for await (const chunk of response) {
		yield {
			type: "text" as const,
			value: chunk.text,
		};
	}
}
export async function chunkPdf(document: string) {
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});
	const texts = await splitter.splitText(document);
	return texts;
}

// for await (const chunk of indexPdf(
// 	"https://chat-pdf-rag.s3.ap-south-1.amazonaws.com/users/cmmcu0mwq0003kws39fdkiznm/1773509431446-PME_StudyGuide.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQV7RFNJYBKKCZIQZ%2F20260316%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260316T120823Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAwaCmFwLXNvdXRoLTEiRzBFAiEAya4SX%2B6gtfJKvElSdKBDPpDKb%2F%2F5KD8fsX3rju6kIqMCIFdJwdKn6k3F7fYP2b%2FwfWssr4N4WwKVP%2F%2Fn00xEdYKmKvgCCNX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMDQ3MjEzNTM3OTA0IgwoSplkElt7dNScojkqzAJzUx9osfTsgucwpGs4sa4Y8QUzLE25kci20VeqVT6XfbfBH%2FtQgJGP%2F5l1IEjS1rk5deMiPfS5AqUYoyI2VKP%2BsCcG5VIwuDnMNxxW79vBCuCazjAv8r9RNv5HTMD1sWgkwFPW3fEHiuold06lS8lBif9lquovWKI2QDzYyylMNyI1szY9Q1awFswWNLPHV%2B%2BVDaIlO31XvXdqGg7mZDRAYzw4sSz561X1%2BEgFSrlRKLm7MMbFQZP3wWfYomSo%2FHZwWd8Qa2D9Z1gx6GbDCQT%2FD1qn7j4WDnaTAoCcT2qFovYTWPVlcBSgZJ5shz5sJRBMlVf%2FOlsNyM1rnewlMeeuRznvtABBMAHHpj%2FFsB9VI8rvuafZ41sVInLt6Z8PyRfJURRc3H6IUMn%2F9joXq4o2S9lw%2Bemrb9ecF8kf5DOCDL7CLPHUe94jOgF%2BojCW5N%2FNBjqtAknB05kG5eATyTiPs2FVjqzO0n8TS910fXG2aYjxtHD%2BDJRCul4iiNnRKHxyx5zdXaHFz%2F%2BlAmz%2Fe87K3gB0Qmhwb3xOp21wStlrME6s4mwAdJd7o2nn7Ts2H4MBQL5aTOJJzNCCVj%2B5ndY%2B%2B%2BjIgs%2FHtGAR9xDjFEGYJz8c3R6NCiguxU%2BXbaLRYarYErVMJphJeVu1Q%2BXHQggUh16okx3nQLANlX7YR2klEJVyoIhvCkhmVqAB2aijAWvREfUUlWGr6IsWpCh12NGDx%2B8RF9XA7t8UUJXGcJG%2F9xEnEOJCMF461ikywMRFUydXydYhWfdYWEsU74%2FwSZbRu9VdOX7GuJVx3Vo5bwOQMrb%2Bx1bsDTSAOY9d1Qy6GZFTwiLpnu3yigSajSyuUCHHRQ4%3D&X-Amz-Signature=5ef1fef2f35bdcc1d7207b316c1e5c2832abd37d3729d4659f41cdaf6a88e45f&X-Amz-SignedHeaders=host&response-content-disposition=inline",
// 	"1",
// )) {
// 	console.log(chunk);
// }
