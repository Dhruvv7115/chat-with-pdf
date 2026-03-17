import { createTRPCRouter } from "../init";
import { chatRouter } from "./chat";
import { messageRouter } from "./message";
import { pdfRouter } from "./pdf";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	user: userRouter,
	pdf: pdfRouter,
	chat: chatRouter,
	message: messageRouter,
});

export type AppRouter = typeof appRouter;
