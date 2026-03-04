import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
	return NextResponse.redirect(new URL("/login", request.url));
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = { matcher: ["/dashboard/:path*"] };
