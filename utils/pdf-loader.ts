import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

export async function loadPdfText(pdfUrl: string) {
	const response = await fetch(pdfUrl);
	console.log("status:", response.status);
	console.log("content-type:", response.headers.get("content-type"));
	const arrayBuffer = await response.arrayBuffer();
	const blob = new Blob([arrayBuffer], { type: "application/pdf" });
	const loader = new PDFLoader(blob);
	const pdf = await loader.load();
	return pdf;
}
// console.log(
// 	await loadPdfText("https://chat-pdf-rag.s3.ap-south-1.amazonaws.com/users/cmmcu0mwq0003kws39fdkiznm/1773509431446-PME_StudyGuide.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQV7RFNJYFW5I423K%2F20260315%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260315T183736Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiSDBGAiEAmeMM%2F8BLv6vA1oiS%2Bgs6fQhUmzkRXDnCev%2Ff%2FzEUsqcCIQCbBrYRnFDPL9vRouz2KAavhS3%2BpKgKRhXncJY7w0Wo%2Byr5AgjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDA0NzIxMzUzNzkwNCIM3tFbyH3ONvhT%2FwaMKs0CLuWF1%2BQialESWYJkR751nl3NfVM7NxwnpqOSOU9mPK0xn3IyxCu5jphH6xah6pWUAkFB7hBgCt1NAH%2BP79YucSPwAlqYhnnKJICiV0fq9dhMVvEKVozgFA1oHVXIOCFjZ22imHM%2FZ%2B10dJm8sAwHdNhOV0g7fc0a7aURDSB1mSD4auiJYjjI5DgRJnDUtWZWqmYRuxAE96TFMD6V7izMKmZSWbDTO5v3xTWfpBdBnvso3tvGGVI19rKy1OC2KwU5sFNoXaAF%2B%2BFiEFQl4ZAZ5E%2FP5oKAAV1%2FwV93nNa9mL0fr6njYkF4ARaUXrDhOw%2F70Ja8gaHZ462i6rFAQFFiBTbi8xS1IwRZzUE4B%2Fckpex%2BWNEvIuJN52Ux8mNj1LT%2Btz%2F%2FYgC%2F%2BkBMJOxNr3WL7A5gsqdvrndJT9%2FiIGnQGSNHhZTTB6jYVIy9ZNQEMIa72s0GOqwCWf4ohkYnqCU2R%2FFdDLeFe8eVwEwb7r0jRRwPjirSAb9mzZhEMpiNd5Vk%2BUh1G7QNNkG4XMp7HftYHre1RQTndyy27z41aELGBVirX60kDPVkpESqvyYpZLp%2Bh2Jpi7lI%2BK2nxF4RZbYpKwmeVDf42unm02x6AtMQZeqPd3afXrX%2B1qn%2BQXCIzUG2IvHXAPbmpt3p1tDb74Noqo%2BeM1NUeRio14kr1UNqQoOb3O1CX3W9MQH%2Bt1mMQUZqN9s4XoKJ4Sb42SbOLai3MYTeZC30OOc2AEBCQq5t%2BBFW6TxbNFh1DJe0A8VQ6Td9QGcf0PDho1a%2FcVQHKM1FU1a5WcFJqjCOZiPyEDukx5ovOdBFDUW4FBukF%2Fwb3EubyBsjDfVSquAKOL73ZFTge1qu&X-Amz-Signature=0021d729a0cc01fa7dae77baa5d907ad01544839359cf422e7f6957764185b67&X-Amz-SignedHeaders=host&response-content-disposition=inline")
// );

// export async function indexPdf(docs: Document[]) {
// 	const content = docs.map((doc) => doc.pageContent).join("\n");

	
// }
