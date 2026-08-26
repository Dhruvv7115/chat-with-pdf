"use client";
import AppSidebar from "@/components/app-sidebar";
import ProfileAvatar from "@/components/profile-avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import LogoutShortcut from "@/components/logout-shortcut";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<LogoutShortcut />
			<AppSidebar />
			<SidebarInset className="h-[calc(100vh-1rem)] flex flex-col overflow-auto">
				<header className="flex items-center justify-between h-16 shrink-0 gap-2 bg-sidebar">
					<div className="flex items-center gap-2 mx-4">
						<SidebarTrigger className="-ml-1" />
					</div>
					<div className="mx-4 flex items-center justify-center gap-4">
						<ThemeToggle />
						<ProfileAvatar />
					</div>
				</header>
				<main className="flex-1 overflow-auto scrollbar-none">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default layout;
