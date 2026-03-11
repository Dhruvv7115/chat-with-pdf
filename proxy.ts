export { default } from "next-auth/middleware";

export const config = {
	matcher: ["/dashboard", "/chat", "/settings", "/billings", "/api/:path*"],
};
