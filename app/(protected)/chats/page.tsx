"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/client";
import {
	Search,
	Plus,
	FileType as FileTypeIcon,
	Bot,
	MessagesSquare,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import ChatRow from "@/components/chat/chat-row";

type ChatCategory = "ALL" | "DOCS" | "GENERAL";

function formatDate(date: Date | string) {
	const d = new Date(date);
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return `Today at ${d.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		})}`;
	}
	if (diffDays === 1) {
		return `Yesterday at ${d.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		})}`;
	}
	if (diffDays < 7) {
		return `${diffDays} days ago`;
	}
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function getFileTypeBadge(fileType?: string) {
	switch (fileType?.toUpperCase()) {
		case "PDF":
			return {
				label: "PDF",
				color:
					"bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
				badgeColor: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
				icon: "pdf",
			};
		case "DOCX":
			return {
				label: "DOCX",
				color:
					"bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
				badgeColor:
					"bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
				icon: "microsoft-word",
			};
		case "MARKDOWN":
		case "MD":
			return {
				label: "MARKDOWN",
				color:
					"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
				badgeColor:
					"bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
				icon: "markdown",
			};
		default:
			return {
				label: fileType || "DOCUMENT",
				color:
					"bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
				badgeColor:
					"bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
				icon: "file",
			};
	}
}

export default function ChatsPage() {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState<ChatCategory>("ALL");
	const [commandOpen, setCommandOpen] = useState(false);

	const { data: chats, isLoading } = api.chat.getAllUserChats.useQuery();

	// Cmd+K / Ctrl+K to open the command search dialog
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setCommandOpen((open) => !open);
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Counts per category
	const counts = useMemo(() => {
		if (!chats) return { all: 0, docs: 0, general: 0 };
		return {
			all: chats.length,
			docs: chats.filter((c) => !!c.documentId).length,
			general: chats.filter((c) => !c.documentId).length,
		};
	}, [chats]);

	// Category-filtered chats (search is handled separately via CommandDialog)
	const filteredChats = useMemo(() => {
		if (!chats) return [];
		return chats.filter((chat) => {
			if (activeCategory === "DOCS") return !!chat.documentId;
			if (activeCategory === "GENERAL") return !chat.documentId;
			return true;
		});
	}, [chats, activeCategory]);

	const categories: { id: ChatCategory; label: string; count: number }[] = [
		{ id: "ALL", label: "All Chats", count: counts.all },
		{ id: "DOCS", label: "Document Chats", count: counts.docs },
		{ id: "GENERAL", label: "General Chats", count: counts.general },
	];

	function goToChat(id: string) {
		setCommandOpen(false);
		router.push(`/chat/${id}`);
	}

	return (
		<div className="p-6 mx-auto flex flex-col gap-6 w-full min-h-full bg-sidebar @container">
			<CommandDialog
				open={commandOpen}
				onOpenChange={setCommandOpen}
			>
				<CommandInput placeholder="Search chats or documents..." />
				<CommandList>
					<CommandEmpty>No conversations found.</CommandEmpty>
					<CommandGroup heading="Conversations">
						{chats?.map((chat) => {
							const isDocChat = !!chat.documentId;
							const typeConfig = isDocChat ? getFileTypeBadge(chat.document?.fileType) : null;
							const IconComponent = typeConfig?.icon === "file" ? FileTypeIcon : (isDocChat ? null : Bot);
							return (
								<CommandItem
									key={chat.id}
									value={`${chat.title} ${chat.document?.title ?? ""}`}
									onSelect={() => goToChat(chat.id)}
								>
									{IconComponent && <IconComponent className="size-4" />}
									{!IconComponent && isDocChat && typeConfig && (
										<Image
											src={`https://thesvg.org/icons/${typeConfig.icon.toLowerCase()}/default.svg`}
											alt="File"
											width={24}
											height={24}
											className="size-4"
										/>
									)}
									<span className="truncate">{chat.title}</span>
									{isDocChat && chat.document?.title && (
										<span className="ml-auto truncate max-w-40 text-xs text-muted-foreground">
											{chat.document.title}
										</span>
									)}
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</CommandDialog>

			{/* Header */}
			<div className="flex flex-col @xl:flex-row justify-between gap-4 border-b pb-5">
				<div>
					<div className="flex items-center gap-2.5">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">
							All Conversations
						</h1>
						{chats && (
							<Badge
								variant="secondary"
								className="font-semibold"
							>
								{chats.length} {chats.length === 1 ? "chat" : "chats"}
							</Badge>
						)}
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Search, manage, and continue your conversations with AI and
						documents.
					</p>
				</div>

				<Link href="/chat">
					<Button
						className="gap-2 font-medium cursor-pointer"
						variant="default"
					>
						<Plus className="size-4" />
						New Chat
					</Button>
				</Link>
			</div>

			{/* Toolbar: Category Tabs + Search trigger */}
			<div className="flex flex-col @[1085px]:flex-row @[1085px]:items-center justify-between gap-4 w-full">
				<Tabs
					value={activeCategory}
					onValueChange={(v) => setActiveCategory(v as ChatCategory)}
				>
					<TabsList>
						{categories.map((cat) => (
							<TabsTrigger
								type="button"
								key={cat.id}
								value={cat.id}
								className="gap-2"
							>
								{cat.label}
								<Badge
									className={cn(
										"px-1.5 py-0.5 rounded-full text-[10px]",
										activeCategory === cat.id
											? "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold"
											: "bg-muted-foreground/15 text-muted-foreground",
									)}
								>
									{cat.count}
								</Badge>
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				<div className="w-full @[780px]:w-auto shrink-0">
					<Button
						variant="outline"
						size="lg"
						onClick={() => setCommandOpen(true)}
						className="flex-1 @[780px]:w-72 w-full justify-between text-muted-foreground font-normal bg-background"
					>
						<span className="flex items-center gap-2">
							<Search className="size-4" />
							Search chats or documents...
						</span>
						<KbdGroup>
							<Kbd>⌘</Kbd>
							<Kbd>k</Kbd>
						</KbdGroup>
					</Button>
				</div>
			</div>

			{/* Empty State - No Chats At All */}
			{!isLoading && chats?.length === 0 && (
				<Card className="flex flex-col items-center justify-center py-16 px-4 text-center border-dashed">
					<div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
						<MessagesSquare className="size-8" />
					</div>
					<h3 className="text-lg font-semibold text-foreground">
						No conversations yet
					</h3>
					<p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
						Start a new chat or upload a document to begin chatting with AI.
					</p>
					<Link href="/chat">
						<Button className="gap-2">
							<Plus className="size-4" />
							Start New Chat
						</Button>
					</Link>
				</Card>
			)}

			{/* Empty State - Category Filter No Match */}
			{!isLoading &&
				chats &&
				chats.length > 0 &&
				filteredChats.length === 0 && (
					<Card className="text-center py-12">
						<p className="text-muted-foreground">
							No conversations found in this category.
						</p>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setActiveCategory("ALL")}
							className="mt-2 text-xs"
						>
							Clear filter
						</Button>
					</Card>
				)}

			{/* Chats List */}
			{!isLoading && filteredChats.length > 0 && (
				<div className="flex flex-col gap-2.5">
					{filteredChats.map((chat) => {
						return (
							<ChatRow
								chat={chat}
								key={chat.id}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
