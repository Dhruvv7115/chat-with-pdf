"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<SessionProvider>
				<TRPCProvider>
					{children}
				</TRPCProvider>
			</SessionProvider>
		</ThemeProvider>
	);
};
// all the providers will go here
