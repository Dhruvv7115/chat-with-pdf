import { z } from "zod";

export const chatPreferencesSchema = z
	.object({
		language: z.enum(["en", "hi"]).optional(),
		responseStyle: z.enum(["concise", "balanced", "detailed"]).optional(),
		persona: z.string().max(500).optional(),
	})
	.optional();

export const chatRequestSchema = z.object({
	chatId: z.string().min(1),
	preferences: chatPreferencesSchema,
	messages: z
		.array(
			z.object({
				id: z.string().min(1),
				role: z.enum(["user", "assistant"]),
				parts: z.array(z.object({ type: z.string() }).passthrough()),
			}),
		)
		.min(1),
});

export type ChatPreferences = z.infer<typeof chatPreferencesSchema>;
