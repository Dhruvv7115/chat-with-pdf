"use server";

import {
	AI_DOC_CHAT_PROMPT,
	AI_NORMAL_CHAT_PROMPT,
	AI_SUMMARY_PROMPT,
} from "@/lib/constants/prompts";
import { GoogleGenAI } from "@google/genai";
import { Preferences } from "@/hooks/use-preferences";

const client = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY!,
});

export async function summarizeDocument(content: string) {
	try {
		const response = await client.models.generateContentStream({
			model: "gemini-3.5-flash-lite",
			contents: content,
			config: {
				systemInstruction: AI_SUMMARY_PROMPT,
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
	preferences?: Preferences,
) {
	const hasContext = context.trim().length > 0;
	let systemInstruction = hasContext
		? AI_DOC_CHAT_PROMPT
		: AI_NORMAL_CHAT_PROMPT;

	console.log("user preferences: ", preferences);

	if (preferences) {
		const { language, responseStyle, persona } = preferences;

		// 1. Language
		if (language === "hi") {
			systemInstruction +=
				"\n\nIMPORTANT: You must write your response in Hindi (हिंदी).";
		} else {
			systemInstruction +=
				"\n\nIMPORTANT: You must write your response in English.";
		}

		// 2. Response Style
		if (responseStyle === "concise") {
			systemInstruction +=
				"\n\nIMPORTANT: Keep your answer extremely brief and concise. Limit to 1-2 sentences maximum.";
		} else if (responseStyle === "detailed") {
			systemInstruction +=
				"\n\nIMPORTANT: Provide a detailed and comprehensive explanation.";
		} else {
			systemInstruction +=
				"\n\nIMPORTANT: Keep your response balanced (informative but direct).";
		}

		// 3. Custom Persona
		if (persona && persona.trim().length > 0) {
			systemInstruction += `\n\nIMPORTANT: Adopt this custom persona/character for your response: "${persona.trim()}". Maintain this style throughout.`;
		}
	}

	try {
		console.log("========== GENERATE ANSWER ==========");
		console.log("QUESTION:", question);
		console.log("HAS CONTEXT:", hasContext);
		console.log("CONTEXT:", context);
		console.log("SYSTEM:", systemInstruction);
		console.log("MESSAGES:", JSON.stringify(formattedMessages, null, 2));
		console.log("====================================");
		const response = await client.models.generateContentStream({
			model: "gemini-3.5-flash-lite",
			config: {
				systemInstruction,
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
