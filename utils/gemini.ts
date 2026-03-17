import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
	apiKey: process.env.GOOGLE_API_KEY!,
});

export async function summarizePdf(content: string) {
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
}

export const generateEmbedding = async (text: string) => {
	const response = await client.models.embedContent({
		model: "gemini-embedding-001",
		contents: text,
	});

	return response.embeddings;
};

// export const generateAnswer = async (question: string, context: string) => {
// 	const response = await client.models.generateContent({
// 		model: "gemini-2.5-flash",
// 		contents: [
// 			{
// 				type: "input_text",
// 				text: `Use the following context to answer the question. If the answer is not present in the context, say you don't know. Context: ${context}`,
// 			},
// 			{
// 				type: "input_text",
// 				text: question,
// 			},
// 		],
// 	});

// 	return response.text;
// };
