"use server";
import { client } from "@/lib/prisma";

export async function checkRateLimit(userId: string): Promise<boolean> {
	const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

	const recentCount = await client.message.count({
		where: {
			role: "USER",
			createdAt: { gte: oneMinuteAgo },
			chat: { userId },
		},
	});

	return recentCount < 10;
}
