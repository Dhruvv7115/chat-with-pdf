import React, { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";
import {
	ArrowRight,
	Bot,
	Clock,
	FileCode,
	FileCode2,
	FileText,
	FileTypeIcon,
	MessageSquare,
	Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/trpc/client";
import { FileType } from "@/lib/generated/prisma/enums";
interface ChatRowProps {
	chat: {
		id: string;
		userId: string;
		createdAt: string;
		updatedAt: string;
		title: string;
		document: {
			id: string;
			title: string;
			fileType: FileType;
		} | null;
		_count: {
			messages: number;
		};
		documentId: string | null;
	};
}

const ChatRow = ({ chat }: ChatRowProps) => {
	const router = useRouter();
	const utils = api.useUtils();
	const deleteChatMutation = api.chat.deleteChat.useMutation({
		onSuccess: () => {
			toast.success("Chat deleted successfully");
			utils.chat.getAllUserChats.invalidate();
			utils.chat.getChats.invalidate();
			utils.chat.getUserChats.invalidate();
			setDeletingId(null);
		},
		onError: (err) => {
			toast.error(err.message || "Failed to delete chat");
			setDeletingId(null);
		},
	});
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [isRowHovered, setIsRowHovered] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLSpanElement>(null);
	const [scrollDistance, setScrollDistance] = useState(0);

	useEffect(() => {
		if (containerRef.current && textRef.current) {
			const containerWidth = containerRef.current.offsetWidth;
			const textWidth = textRef.current.offsetWidth;

			console.log(textWidth, containerWidth);
			if (textWidth > containerWidth) {
				setScrollDistance(textWidth - containerWidth);
			} else {
				setScrollDistance(0);
			}
		}
	}, [chat.title]);
	const duration =
		isRowHovered && scrollDistance > 0 ? `${scrollDistance / 30}s` : "0.4s";

	const isDocChat = !!chat.documentId;
	const fileTypeBadge = isDocChat
		? getFileTypeBadge(chat.document?.fileType)
		: null;
	const IconComponent = fileTypeBadge ? fileTypeBadge.icon : Bot;
	return (
		<Card
			key={chat.id}
			onMouseEnter={() => setIsRowHovered(true)}
			onMouseLeave={() => setIsRowHovered(false)}
			onClick={() => router.push(`/chat/${chat.id}`)}
			className={cn(
				"group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4",
				"hover:bg-muted/30 hover:border-primary/40 transition-all duration-200 cursor-pointer",
			)}
		>
			{/* Left: Icon & Info */}
			<div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
				<div
					className={cn(
						"p-2.5 rounded-lg border shrink-0 transition-transform duration-200 group-hover:scale-105",
						isDocChat && fileTypeBadge
							? fileTypeBadge.color
							: "bg-primary/10 text-primary border-primary/20",
					)}
				>
					<IconComponent className="size-5" />
				</div>

				<div className="min-w-0 flex-1 flex flex-col gap-1">
					<div className="flex items-center gap-2 flex-wrap">
						<h3
							className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors overflow-hidden max-w-full"
							title={chat.title}
							ref={containerRef}
						>
							<span
								ref={textRef}
								className="inline-block whitespace-nowrap will-change-transform ease-linear"
								style={{
									transform:
										isRowHovered && scrollDistance > 0
											? `translateX(-${scrollDistance}px)`
											: "translateX(0px)",
									transitionProperty: "transform",
									transitionDuration: duration,
								}}
							>
								{chat.title}
							</span>
						</h3>

						{isDocChat && fileTypeBadge ? (
							<Badge
								variant="outline"
								className={cn(
									"text-[10px] font-bold uppercase",
									fileTypeBadge.badgeColor,
								)}
							>
								{fileTypeBadge.label}
							</Badge>
						) : (
							<Badge
								variant="secondary"
								className="text-[10px] font-medium"
							>
								General
							</Badge>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
						{isDocChat && chat.document?.title && (
							<span className="truncate max-w-50 sm:max-w-xs">
								Doc: {chat.document.title}
							</span>
						)}

						<span className="flex items-center gap-1">
							<MessageSquare className="size-3" />
							{chat._count?.messages ?? 0}{" "}
							{(chat._count?.messages ?? 0) === 1 ? "message" : "messages"}
						</span>

						<span className="flex items-center gap-1">
							<Clock className="size-3" />
							{formatDate(chat.updatedAt)}
						</span>
					</div>
				</div>
			</div>

			{/* Right: Actions */}
			<div
				className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Delete Chat Action */}
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
							disabled={deleteChatMutation.isPending && deletingId === chat.id}
						>
							<Trash2 className="size-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent onClick={(e) => e.stopPropagation()}>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Conversation</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete &quot;{chat.title}
								&quot;? All messages in this chat will be permanently removed.
								This action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									setDeletingId(chat.id);
									deleteChatMutation.mutate({ id: chat.id });
								}}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<Separator
					orientation="vertical"
					className="h-6 hidden sm:block"
				/>

				{/* Open Chat Link */}
				<Link href={`/chat/${chat.id}`}>
					<Button
						variant="secondary"
						size="sm"
						className="h-8 gap-1.5 text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all cursor-pointer hover:bg-primary/80 hover:text-primary-foreground"
					>
						Open
						<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
					</Button>
				</Link>
			</div>
		</Card>
	);
};

export default ChatRow;

function getFileTypeBadge(fileType?: string) {
	switch (fileType?.toUpperCase()) {
		case "PDF":
			return {
				label: "PDF",
				color:
					"bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
				badgeColor: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
				icon: FileText,
			};
		case "DOCX":
			return {
				label: "DOCX",
				color:
					"bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
				badgeColor:
					"bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
				icon: FileCode2,
			};
		case "MARKDOWN":
		case "MD":
			return {
				label: "MARKDOWN",
				color:
					"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
				badgeColor:
					"bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
				icon: FileCode,
			};
		default:
			return {
				label: fileType || "DOCUMENT",
				color:
					"bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
				badgeColor:
					"bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
				icon: FileTypeIcon,
			};
	}
}

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
