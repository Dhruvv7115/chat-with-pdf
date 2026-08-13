import { createTRPCRouter } from "../init";
import { chatRouter } from "./chat";
import { messageRouter } from "./message";
import { pdfRouter } from "./document";
import { subscriptionRouter } from "./subscription";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	user: userRouter,
	pdf: pdfRouter,
	chat: chatRouter,
	message: messageRouter,
	subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
