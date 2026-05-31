"use client";

import { api } from "@/trpc/client";
import Link from "next/link";
import { IconMessageCircleFilled } from "@tabler/icons-react";

function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isToday(dateStr: string) {
	const date = new Date(dateStr);
	const now = new Date();
	return date.toDateString() === now.toDateString();
}

export default function DashboardChats() {
	const { data: chats, isLoading } = api.chat.getChats.useQuery();

	return (
		<div className="border border-border rounded-xl p-5 bg-background">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
					Recent Chats
				</h2>
				<Link
					href="/chat"
					className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
				>
					View all
				</Link>
			</div>

			{isLoading && (
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-center gap-3 py-2 animate-pulse"
						>
							<div className="w-2 h-2 rounded-full bg-muted shrink-0" />
							<div className="flex-1 space-y-1.5">
								<div className="h-3 bg-muted rounded w-3/4" />
								<div className="h-2.5 bg-muted rounded w-1/2" />
							</div>
							<div className="h-2.5 bg-muted rounded w-8" />
						</div>
					))}
				</div>
			)}

			{!isLoading && (!chats || chats.length === 0) && (
				<div className="flex flex-col items-center justify-center py-8 text-center">
					<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3 text-lg">
						<IconMessageCircleFilled />
					</div>
					<p className="text-sm text-muted-foreground">No chats yet</p>
					<p className="text-xs text-muted-foreground mt-1">
						Upload a PDF to start chatting
					</p>
				</div>
			)}

			{!isLoading && chats && chats.length > 0 && (
				<ul className="divide-y divide-border">
					{chats.slice(0, 5).map((chat) => {
						const active = isToday(chat.updatedAt);
						return (
							<li key={chat.id}>
								<Link
									href={`/chat/${chat.id}`}
									className="flex items-center gap-3 py-2.5 hover:bg-muted/40 -mx-1 px-1 rounded-md transition-colors"
								>
									<span className="p-1 bg-muted rounded">
										<IconMessageCircleFilled className="text-neutral-400" />
									</span>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{chat.title}</p>
										<p className="text-xs text-muted-foreground truncate">
											{chat.pdfId ? `PDF chat` : "General chat"}
										</p>
									</div>
									<span className="text-xs text-muted-foreground shrink-0">
										{formatDate(chat.updatedAt)}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
