"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/trpc/client";

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<SessionProvider>
			<TRPCProvider>
				{children}
			</TRPCProvider>
		</SessionProvider>
	);
};
// all the providers will go here
