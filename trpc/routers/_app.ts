import { createTRPCRouter } from "../init";
import { chatRouter } from "./chat";
import { pdfRouter } from "./pdf";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	user: userRouter,
	pdf: pdfRouter,
	chat: chatRouter,
});

export type AppRouter = typeof appRouter;
