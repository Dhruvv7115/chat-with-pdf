import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
	apiKey: process.env.GOOGLE_API_KEY!,
});

export async function summarizePdf(content: string) {
	try {
		const response = await client.models.generateContentStream({
			model: "gemini-2.5-flash",
			contents: content,
			config: {
				systemInstruction: `
				  You are an expert document analyst. Provide a clear and structured summary of the provided PDF.
	
					Your response must follow this format:
	
					**Document Type:** (e.g. Resume, Research Paper, Study Guide, Contract)
	
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
		throw new Error("Error summarizing PDF");
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
	try {
		const response = await client.models.generateContentStream({
			model: "gemini-2.5-flash",
			config: {
				systemInstruction: `You are a helpful assistant for answering questions about a PDF document.

				Rules:
				- Answer questions directly and conversationally, never mention "the context" or "the PDF" in your response
				- If the answer is fully available, just answer it
				- If the topic is related to the PDF but needs general knowledge to fully answer, use your own knowledge to fill the gaps and give a complete answer
				- Only if the question is completely unrelated to the PDF, respond with: "This PDF doesn't have information about that topic."
				- Never start responses with phrases like "Based on the provided context..." or "According to the PDF..."
				- Be concise and natural`,
			},
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `Here is the relevant context from the PDF:\n\n${context}`,
						},
					],
				},
				{
					role: "model",
					parts: [{ text: "Understood, I'll answer based on this context." }],
				},
				...formattedMessages,

				// current message
				{
					role: "user",
					parts: [{ text: question }],
				},
			],
		});

		return response;
	} catch (error) {
		console.log("error:", error);
		throw new Error("Error generating answer");
	}
}
