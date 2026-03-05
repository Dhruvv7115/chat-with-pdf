// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { client as prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
	// Use JWT strategy because we're using CredentialsProvider
	// (Credentials doesn't work with database sessions)
	session: {
		strategy: "jwt",
	},

	// Point NextAuth to your custom pages — it won't use its default UI
	pages: {
		signIn: "/login",
		error: "/login", // errors redirect back to signin with ?error=
	},

	providers: [
		// ─── Email + Password ──────────────────────────────────────────
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password required");
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.password) {
					throw new Error("No account found with this email");
				}

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password,
				);

				if (!isValid) {
					throw new Error("Incorrect password");
				}

				return {
					id: user.id,
					email: user.email,
					name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
					image: user.avatar,
				};
			},
		}),

		// ─── Google OAuth ──────────────────────────────────────────────
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			profile(profile) {
				console.log("profile", profile);
				return {
					id: profile.sub,
					firstName: profile.given_name,
					lastName: profile.family_name,
					email: profile.email,
					avatar: profile.picture,
					name: profile.name,
					emailVerified: profile.email_verified ? new Date() : undefined,
				};
			},
		}),

		// ─── GitHub OAuth ──────────────────────────────────────────────
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			profile(profile) {
				console.log("profile", profile);
				const [firstName, ...rest] = (profile.name ?? profile.login).split(" ");
				return {
					id: String(profile.id),
					firstName,
					lastName: rest.join(" ") || null,
					email: profile.email,
					avatar: profile.avatar_url,
					name: profile.name ?? profile.login,
				};
			},
		}),
	],

	callbacks: {
		// Save user to database and attach data to JWT token
		async jwt({ token, user }) {
			if (user) {
				console.log("user", user);
				// Save or update user in database for OAuth providers
				const dbUser = await prisma.user.upsert({
					where: { email: user.email || "" },
					update: {
						firstName: user?.firstName || user.name?.split(" ")[0],
						lastName: user.lastName || user.name?.split(" ").slice(1).join(" "),
						avatar: user.image || user.avatar,
					},
					create: {
						email: user.email || "",
						emailVerified: user.emailVerified!,
						firstName: user.firstName || "",
						lastName: user.lastName || "",
						avatar: user.image || user.avatar,
					},
				});

				token.id = dbUser.id;
				token.name = user.name;
				token.avatar = dbUser.avatar;
			}
			return token;
		},

		// Expose token data on the session object (accessible via useSession)
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.name = token.name as string;
				session.user.avatar = token.avatar as string;
			}
			return session;
		},
	},
};
