import middleware from "next-auth/middleware";

export { middleware as proxy };

export const config = {
	matcher: [
		"/dashboard",
		"/chat",
		"/settings",
		"/billings",
		"/api/((?!webhooks).*)",
	],
};
