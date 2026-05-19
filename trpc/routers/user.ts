import { publicProcedure, createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { client } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "@/utils/bcrypt";
import { uploadUserImage } from "@/utils/s3";

export const userRouter = createTRPCRouter({
	register: publicProcedure
		.input(
			z.object({
				firstName: z.string(),
				lastName: z.string(),
				email: z.string().email(),
				password: z.string().min(8),
			}),
		)
		.mutation(async ({ input }) => {
			const { firstName, lastName, email, password } = input;
			if (!firstName || !lastName || !email || !password) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "All fields are required",
				});
			}
			if (password.length < 8) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Password must be at least 8 characters",
				});
			}
			const existingUser = await client.user.findUnique({
				where: { email },
			});
			if (existingUser) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "User already exists",
				});
			}

			const passwordHash = await hashPassword(password);
			try {
				const user = await client.user.create({
					data: {
						firstName,
						lastName,
						email,
						password: passwordHash,
					},
				});
				return {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
				};
			} catch (error) {
				console.log(error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
				});
			}
		}),

	updateProfile: protectedProcedure
		.input(
			z.object({
				firstName: z.string().optional(),
				lastName: z.string().optional(),
				email: z.string().optional(),
				userAvatar: z.file().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			console.log(input);
			if (
				!input.email &&
				!input.firstName &&
				!input.lastName &&
				!input.userAvatar
			)
				return new TRPCError({
					code: "BAD_REQUEST",
					message: "atleast one field is necessary",
				});
			let image;
			if (input.userAvatar)
				image = uploadUserImage(ctx.userId, input.userAvatar);
			const updatedUser = await client.user.update({
				where: {
					id: ctx.userId,
				},
				data: input,
			});
			console.log("updatedUser", updatedUser);
			return updatedUser;
		}),

	getProfile: protectedProcedure.query(async ({ ctx }) => {
		const user = await client.user.findUnique({
			where: { id: ctx.userId },
		});
		console.log("user", user);
		return user;
	}),
});
