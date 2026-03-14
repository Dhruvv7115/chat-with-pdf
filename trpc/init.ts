import { authOptions } from "@/lib/auth";
import { initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { cache } from "react";
export const createTRPCContext = cache(async () => {
	/**
	 * @see: https://trpc.io/docs/server/context
	 */
	return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
	/**
	 * @see https://trpc.io/docs/server/data-transformers
	 */
	// transformer: superjson,
});

const authenticationMiddleware = t.middleware(async ({ ctx, next }) => {
	const session = await getServerSession(authOptions);
	if (!session) {
		throw new Error("Unauthorized");
	}

	return next({
		ctx: {
			userId: session.user.id,
		},
	});
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authenticationMiddleware);
