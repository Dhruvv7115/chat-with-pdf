"use server";

import {
	AI_DOC_CHAT_PROMPT,
	AI_NORMAL_CHAT_PROMPT,
	AI_SUMMARY_PROMPT,
} from "@/constants/prompts/main-prompts";
import {
	createGoogleGenerativeAI,
	type GoogleEmbeddingModelOptions,
} from "@ai-sdk/google";
import { embed, streamText, type ModelMessage } from "ai";
import type { ChatPreferences } from "@/lib/validation/chat";

const google = createGoogleGenerativeAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export async function summarizeDocument(content: string) {
	return streamText({
		model: google("gemini-3.5-flash-lite"),
		system: AI_SUMMARY_PROMPT,
		prompt: content,
	});
}

export const generateEmbedding = async (text: string) => {
	try {
		const { embedding } = await embed({
			model: google.embedding("gemini-embedding-001"),
			value: text,
			providerOptions: {
				google: {
					outputDimensionality: 768,
					taskType: "RETRIEVAL_DOCUMENT",
				} satisfies GoogleEmbeddingModelOptions,
			},
		});

		return embedding;
	} catch (error) {
		console.log("error:", error);
		throw new Error("Error generating embedding");
	}
};

export async function generateQueryEmbedding(text: string) {
	try {
		const { embedding } = await embed({
			model: google.embedding("gemini-embedding-001"),
			value: text,
			providerOptions: {
				google: {
					outputDimensionality: 768,
					taskType: "RETRIEVAL_QUERY",
				} satisfies GoogleEmbeddingModelOptions,
			},
		});

		return embedding;
	} catch (error) {
		console.log("error:", error);
		throw new Error("Error generating query embedding");
	}
}

export async function generateAnswer({
	context,
	messages,
	preferences,
}: {
	context: string;
	messages: ModelMessage[];
	preferences: ChatPreferences;
}) {
	const hasContext = context.trim().length > 0;
	let systemInstruction = hasContext
		? AI_DOC_CHAT_PROMPT
		: AI_NORMAL_CHAT_PROMPT;

	if (preferences) {
		const { language, responseStyle, persona } = preferences;

		// 1. Language
		if (language === "hi") {
			systemInstruction +=
				"\n\nIMPORTANT: You must write your response in Hindi (हिंदी).";
		} else if (preferences.responseStyle === "balanced") {
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

	if (hasContext) {
		systemInstruction += `\n\nHere is the relevant context from the document:\n\n${context}`;
	}

	return streamText({
		model: google("gemini-3.5-flash-lite"),
		system: systemInstruction,
		messages,
	});
}
