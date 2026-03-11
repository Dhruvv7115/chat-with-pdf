"use client";
import AppSidebar from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { TRPCProvider } from "@/trpc/client";
import { SessionProvider } from "next-auth/react";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" />
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
};

export default layout;
