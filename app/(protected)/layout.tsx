"use client";
import AppSidebar from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="h-[calc(100vh-1rem)] flex flex-col overflow-auto">
				<header className="flex h-16 shrink-0 items-center gap-2 bg-sidebar">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
					</div>
				</header>
				<div className="flex-1 overflow-auto scrollbar-none">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default layout;
