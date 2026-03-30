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
			<SidebarInset className="h-[calc(100vh-1rem)] flex flex-col rounded-xl">
				<header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" />
					</div>
				</header>
				<div className="flex-1 overflow-hidden">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default layout;
