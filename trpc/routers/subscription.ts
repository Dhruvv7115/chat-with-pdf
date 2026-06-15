import { protectedProcedure, createTRPCRouter } from "../init";
import { client } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

export const subscriptionRouter = createTRPCRouter({
	createProSubscription: protectedProcedure.query(async ({ ctx }) => {
    const pro = await client.subscription.create({
      data: {
        userId: ctx.userId,
        plan: "PRO"
      },
    })
	}),
});
