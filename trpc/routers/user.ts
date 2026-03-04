import { publicProcedure, createTRPCRouter } from "../init";

export const userRouter = createTRPCRouter({
	getById: publicProcedure.query(({ ctx }) => {
		return "user_123";
	}),
});
