"use client";

import { api } from "@/trpc/client";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

export default function DashboardChats() {
	const { data: chats, isLoading } = api.chat.getChats.useQuery();

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
					Recent Chats
				</CardTitle>
				<Button
					variant="link"
					size="sm"
					className="h-auto p-0 text-xs"
					asChild
				>
					<Link href="/chats">View all</Link>
				</Button>
			</CardHeader>

			<CardContent>
				{isLoading && (
					<div className="flex flex-col gap-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="flex items-center gap-3"
							>
								<Skeleton className="size-8 rounded-lg shrink-0" />
								<div className="flex-1 flex flex-col gap-1.5">
									<Skeleton className="h-3 w-3/4" />
									<Skeleton className="h-2.5 w-1/2" />
								</div>
								<Skeleton className="h-2.5 w-8" />
							</div>
						))}
					</div>
				)}

				{!isLoading && (!chats || chats.length === 0) && (
					<div className="flex flex-col items-center justify-center py-8 text-center gap-3">
						<div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
							<MessageSquare className="size-5" />
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-sm text-muted-foreground">No chats yet</p>
							<p className="text-xs text-muted-foreground">
								Upload a PDF to start chatting
							</p>
						</div>
					</div>
				)}

				{!isLoading && chats && chats.length > 0 && (
					<div className="flex flex-col">
						{chats.slice(0, 5).map((chat, i) => (
							<div key={chat.id}>
								<Link
									href={`/chat/${chat.id}`}
									className="flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-md hover:bg-accent transition-colors"
								>
									<span className="flex items-center justify-center size-8 rounded-lg bg-muted text-muted-foreground shrink-0">
										<MessageSquare className="size-4" />
									</span>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{chat.title}</p>
										<Badge
											variant="secondary"
											className="text-[10px] font-normal mt-0.5"
										>
											{chat.documentId ? "Document chat" : "General chat"}
										</Badge>
									</div>
									<span className="text-xs text-muted-foreground shrink-0">
										{formatDate(chat.updatedAt)}
									</span>
								</Link>
								{i < chats.slice(0, 5).length - 1 && <Separator />}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
