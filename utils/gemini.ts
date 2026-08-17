import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY!,
});


export async function summarizeDocument(content: string) {
	try {
		const response = await client.models.generateContentStream({
			model: "gemini-3.5-flash-lite",
			contents: content,
			config: {
				systemInstruction: `
				  You are an expert document analyst. Provide a clear and structured summary of the provided document.

					Your response must follow this format:

					**Document Type:** (e.g. Resume, Research Paper, Study Guide, Contract, Spreadsheet, Presentation)

					**Overview:**
					2-3 sentences describing what the document is about and its purpose.

					**Key Highlights:**
					- 4-6 bullet points covering the most important information
					- Be specific — include names, numbers, and facts where relevant

					**Takeaway:**
					One sentence on the single most important thing to know about this document.

					Guidelines:
					- Never add information not present in the document
					- Keep it concise but informative
					- Explain technical concepts in plain English

					Example for a resume:
					**Document Type:** Resume

					**Overview:**
					This is a resume for a senior software engineer with 5 years of experience at top tech companies. The candidate is targeting senior engineering roles with a strong focus on backend development.

					**Key Highlights:**
					- Experience at Google, Amazon, and Microsoft
					- Proficient in Python, Java, and TypeScript
					- Led a team of 6 engineers, shipping a product used by 2M users
					- BS in Computer Science from UC Berkeley

					**Takeaway:**
					A strong senior engineering profile with proven impact at top-tier companies.
				`,
			},
		});

		return response;
	} catch (error) {
		console.log("error:", error);
		throw new Error("Error summarizing document");
	}
}

export const generateEmbedding = async (text: string) => {
	try {
		const response = await client.models.embedContent({
			model: "gemini-embedding-001",
			contents: text,
			config: {
				outputDimensionality: 768,
				taskType: "RETRIEVAL_DOCUMENT",
			},
		});

		if (!response.embeddings) {
			throw new Error("Error generating embedding");
		} else {
			console.log("embedding generated");
		}

		return response.embeddings?.[0].values ?? [];
	} catch (error) {
		console.log("error:", error);
		throw new Error("Error generating embedding");
	}
};

export async function generateQueryEmbedding(text: string) {
	try {
		console.log("generating query embedding:", text);
		const response = await client.models.embedContent({
			model: "gemini-embedding-001",
			contents: text,
			config: {
				outputDimensionality: 768,
				taskType: "RETRIEVAL_QUERY",
			},
		});

		return response.embeddings?.[0].values ?? [];
	} catch (error) {
		console.log("error:", error);
		throw new Error("Error generating query embedding");
	}
}

export async function generateAnswer(
	question: string,
	context: string,
	formattedMessages: {
		role: "user" | "model";
		parts: { text: string }[];
	}[],
) {
	const hasContext = context.trim().length > 0;

	try {
		const response = await client.models.generateContentStream({
			model: "gemini-3.5-flash-lite",
			config: {
				systemInstruction: hasContext
					? `You are a helpful assistant for answering questions about a document.

					Rules:
					- Answer questions directly and conversationally, never mention "the context" or "the document" in your response
					- If the answer is fully available, just answer it
					- If related but needs general knowledge to fully answer, fill gaps with your own knowledge
					- Only if completely unrelated, respond with: "This document doesn't have information about that topic."
					- Never start with "Based on the provided context..." or "According to the document..."
					- Be concise and natural`
					: `You are a helpful, friendly assistant. Have a normal conversation and answer questions accurately and concisely.`,
			},
			contents: [
				...(hasContext
					? [
							{
								role: "user" as const,
								parts: [
									{
										text: `Here is the relevant context from the document:\n\n${context}`,
									},
								],
							},
							{
								role: "model" as const,
								parts: [
									{ text: "Understood, I'll answer based on this context." },
								],
							},
						]
					: []),
				...formattedMessages,
				{ role: "user", parts: [{ text: question }] },
			],
		});

		return response;
	} catch (error) {
		console.log("error:", error);
		throw new Error("Error generating answer");
	}
}
