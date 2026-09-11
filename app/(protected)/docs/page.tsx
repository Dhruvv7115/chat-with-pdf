"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import {
	FileText,
	MessageSquare,
	ExternalLink,
	Trash2,
	Maximize2,
	Plus,
	Calendar,
	HardDrive,
	Layers,
	FileCode,
	FileCode2,
	Files,
	FileType as FileTypeIcon,
	MoreVertical,
	SearchIcon,
	LayoutGrid,
	List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
	Attachment,
	AttachmentMedia,
	AttachmentContent,
	AttachmentTitle,
	AttachmentDescription,
	AttachmentActions,
	AttachmentAction,
	AttachmentTrigger,
} from "@/components/ui/attachment";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { IconEyeFilled, IconX } from "@tabler/icons-react";
import { motion } from "motion/react";

type FileCategory = "ALL" | "PDF" | "DOCX" | "MARKDOWN" | "OTHER";

function formatDate(date: Date | string) {
	return new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatBytes(bytes?: number | null) {
	if (!bytes) return null;
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isUrlExpired(url?: string | null): boolean {
	if (!url) return true;
	try {
		const parsed = new URL(url);
		const amzDate = parsed.searchParams.get("X-Amz-Date");
		const amzExpires = parsed.searchParams.get("X-Amz-Expires");
		if (amzDate && amzExpires) {
			const year = Number(amzDate.slice(0, 4));
			const month = Number(amzDate.slice(4, 6)) - 1;
			const day = Number(amzDate.slice(6, 8));
			const hour = Number(amzDate.slice(9, 11));
			const minute = Number(amzDate.slice(11, 13));
			const second = Number(amzDate.slice(13, 15));
			const issuedAt = Date.UTC(year, month, day, hour, minute, second);
			const expiresAt = issuedAt + Number(amzExpires) * 1000;
			return Date.now() >= expiresAt;
		}
		const expiresParam = parsed.searchParams.get("Expires");
		if (expiresParam && !Number.isNaN(Number(expiresParam))) {
			return Date.now() >= Number(expiresParam) * 1000;
		}
	} catch {
		return false;
	}
	return false;
}

function getFileTypeConfig(fileType?: string) {
	switch (fileType?.toUpperCase()) {
		case "PDF":
			return {
				label: "PDF",
				tint: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
				icon: "pdf",
			};
		case "DOCX":
			return {
				label: "DOCX",
				tint: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
				icon: "microsoft-word",
			};
		case "MARKDOWN":
		case "MD":
			return {
				label: "MARKDOWN",
				tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
				icon: "markdown",
			};
		default:
			return {
				label: fileType || "DOCUMENT",
				tint: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
				icon: "file",
			};
	}
}

export default function DocsPage() {
	const router = useRouter();
	const utils = api.useUtils();
	const [searchQuery, setSearchQuery] = useState("");
	const [commandOpen, setCommandOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState<FileCategory>("ALL");

	const [previewDoc, setPreviewDoc] = useState<{
		id: string;
		title: string;
		url: string;
		fileType?: string;
	} | null>(null);
	const [failedPreviewIds, setFailedPreviewIds] = useState<Set<string>>(
		new Set(),
	);
	const [expiryTick, setExpiryTick] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => setExpiryTick((t) => t + 1), 30_000);
		return () => clearInterval(interval);
	}, []);

	const { data: docs, isLoading } = api.pdf.getAllUserDocsWithUrls.useQuery();

	const deleteDocMutation = api.pdf.deleteFile.useMutation({
		onSuccess: () => {
			toast.success("Document deleted successfully");
			utils.pdf.getAllUserDocsWithUrls.invalidate();
			utils.pdf.getUserDocs.invalidate();
		},
		onError: (err) => {
			toast.error(err.message || "Failed to delete document");
		},
	});

	const getOrCreateChatMutation = api.chat.getOrCreateChat.useMutation({
		onSuccess: (chat) => {
			toast.success("Opening chat...");
			router.push(`/chat/${chat.id}`);
		},
		onError: (err) => {
			toast.error(err.message || "Failed to open chat");
		},
	});

	const handleOpenChat = (docId: string, docTitle: string) => {
		getOrCreateChatMutation.mutate({
			docId,
			title: docTitle,
		});
	};

	// ⌘K / Ctrl+K opens the command palette from anywhere on the page
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setCommandOpen((open) => !open);
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Counts per category
	const counts = useMemo(() => {
		if (!docs) return { all: 0, pdf: 0, docx: 0, markdown: 0, other: 0 };
		return {
			all: docs.length,
			pdf: docs.filter((d) => d.fileType === "PDF").length,
			docx: docs.filter((d) => d.fileType === "DOCX").length,
			markdown: docs.filter((d) => d.fileType === "MARKDOWN").length,
			other: docs.filter(
				(d) => !["PDF", "DOCX", "MARKDOWN"].includes(d.fileType),
			).length,
		};
	}, [docs]);

	// Grid view: filtered by active tab + last committed search term
	const filteredDocs = useMemo(() => {
		if (!docs) return [];
		return docs.filter((doc) => {
			const matchesSearch = doc.title
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			if (!matchesSearch) return false;

			if (activeCategory === "ALL") return true;
			if (activeCategory === "PDF") return doc.fileType === "PDF";
			if (activeCategory === "DOCX") return doc.fileType === "DOCX";
			if (activeCategory === "MARKDOWN") return doc.fileType === "MARKDOWN";
			if (activeCategory === "OTHER")
				return !["PDF", "DOCX", "MARKDOWN"].includes(doc.fileType);
			return true;
		});
	}, [docs, searchQuery, activeCategory]);

	const categories: { id: FileCategory; label: string; count: number }[] = [
		{ id: "ALL", label: "All Documents", count: counts.all },
		{ id: "PDF", label: "PDF Documents", count: counts.pdf },
		{ id: "DOCX", label: "Word (DOCX)", count: counts.docx },
		{ id: "MARKDOWN", label: "Markdown (MD)", count: counts.markdown },
		...(counts.other > 0
			? [
					{
						id: "OTHER" as FileCategory,
						label: "Other Files",
						count: counts.other,
					},
				]
			: []),
	];

	return (
		<div className="p-6 mx-auto flex flex-col gap-6 w-full min-h-full bg-sidebar @container">
			{/* Page Header */}
			<div className="flex flex-col @xl:flex-row justify-between gap-4 border-b pb-5">
				<div>
					<div className="flex items-center gap-2.5">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">
							Uploaded Documents
						</h1>
						{docs && (
							<Badge
								variant="secondary"
								className="px-2.5 py-0.5 text-xs font-semibold"
							>
								{docs.length} {docs.length === 1 ? "document" : "documents"}
							</Badge>
						)}
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						View, chat with, and manage your PDF, Word, and Markdown documents.
					</p>
				</div>

				<Link href="/chat">
					<Button className="gap-2 shadow-sm font-medium">
						<Plus className="size-4" />
						Upload New Document
					</Button>
				</Link>
			</div>

			{/* Category Filter Tabs & Search Toolbar */}
			<div className="flex flex-col @[1085px]:flex-row @[1085px]:items-center justify-between gap-4 w-full">
				{/* DESKTOP/TABLET VIEW: Tabs visible when container >= 780px */}
				<Tabs
					value={activeCategory}
					onValueChange={(v) => setActiveCategory(v as FileCategory)}
					className="hidden @[780px]:block"
				>
					<TabsList className="h-auto gap-1.5 p-1">
						{categories.map((cat) => (
							<TabsTrigger
								key={cat.id}
								value={cat.id}
								className="gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium data-[state=active]:font-semibold"
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
				{/* MOBILE VIEW: Select Dropdown visible when container < 780px */}
				<div className="block @[780px]:hidden w-full">
					<Select
						value={activeCategory}
						onValueChange={(v) => setActiveCategory(v as FileCategory)}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Document Categories</SelectLabel>
								{categories.map((cat) => (
									<SelectItem
										key={cat.id}
										value={cat.id}
									>
										<div className="flex w-fit items-center justify-center gap-2">
											<span>{cat.label}</span>
											<Badge className="px-1.5 py-0.5 rounded-full text-[10px] bg-muted-foreground/15 text-muted-foreground ml-auto">
												{cat.count}
											</Badge>
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{/* Search Toggle */}
				<div className="w-full @[780px]:w-auto shrink-0">
					<Button
						variant="outline"
						onClick={() => setCommandOpen(true)}
						className="flex-1 @[780px]:w-72 w-full justify-between text-muted-foreground font-normal bg-background"
					>
						<span className="flex items-center gap-2">
							<SearchIcon className="size-4" />
							Search documents...
						</span>
						<KbdGroup>
							<Kbd>⌘</Kbd>
							<Kbd>k</Kbd>
						</KbdGroup>
					</Button>
				</div>
			</div>

			{/* Command palette: searches across ALL documents regardless of the active tab */}
			<CommandDialog
				open={commandOpen}
				onOpenChange={setCommandOpen}
			>
				<CommandInput
					placeholder="Search documents by title..."
					value={searchQuery}
					onValueChange={setSearchQuery}
				/>
				<CommandList>
					<CommandEmpty>No documents found.</CommandEmpty>
					<CommandGroup heading="Documents">
						{(docs ?? []).map((doc) => {
							const typeConfig = getFileTypeConfig(doc.fileType);
							const TypeIcon = typeConfig.icon === "file" ? FileTypeIcon : null;
							return (
								<CommandItem
									key={doc.id}
									value={doc.title}
									onSelect={() => {
										setCommandOpen(false);
										handleOpenChat(doc.id, doc.title);
									}}
									className="gap-2"
								>
									{TypeIcon && (
										<TypeIcon className="size-4 text-muted-foreground" />
									)}
									{!TypeIcon && (
										<Image
											src={`https://thesvg.org/icons/${typeConfig.icon.toLowerCase()}/default.svg`}
											alt="File"
											width={24}
											height={24}
										/>
									)}
									<span className="truncate">{doc.title}</span>
									<CommandShortcut>{typeConfig.label}</CommandShortcut>
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</CommandDialog>

			{/* Empty State: no documents at all */}
			{!isLoading && docs?.length === 0 && (
				<Empty className="border-2 border-dashed rounded-xl bg-card py-16">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Files />
						</EmptyMedia>
						<EmptyTitle>No documents uploaded yet</EmptyTitle>
						<EmptyDescription>
							Upload your PDF, Word, or Markdown documents to preview them here
							and start asking AI questions about them.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Link href="/chat">
							<Button className="gap-2">
								<Plus className="size-4" />
								Upload Document Now
							</Button>
						</Link>
					</EmptyContent>
				</Empty>
			)}

			{/* Empty State: filters produced nothing */}
			{!isLoading && docs && docs.length > 0 && filteredDocs.length === 0 && (
				<Empty className="border rounded-xl bg-card py-12">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SearchIcon />
						</EmptyMedia>
						<EmptyTitle>No matching documents</EmptyTitle>
						<EmptyDescription>
							Nothing matches your current filters. Try a different search term
							or tab.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							variant="secondary"
							size="sm"
							onClick={() => {
								setSearchQuery("");
								setActiveCategory("ALL");
							}}
						>
							Clear all filters
						</Button>
					</EmptyContent>
				</Empty>
			)}

			{/* Document View */}
			{!isLoading && filteredDocs.length > 0 && (
				<div
					className={cn(
						"grid grid-cols-1 @[780px]:grid-cols-2 @[1085px]:grid-cols-3 gap-4",
					)}
				>
					{filteredDocs.map((doc) => {
						const typeConfig = getFileTypeConfig(doc.fileType);
						const TypeIcon = typeConfig.icon === "file" ? FileTypeIcon : null;

						return (
							<Attachment
								key={doc.id}
								orientation="horizontal"
								className={cn(
									"group hover:border-primary/40 hover:shadow-md transition-all duration-200 w-full max-w-full",
								)}
							>
								<AttachmentMedia
									variant="icon"
									className={typeConfig.tint}
								>
									{TypeIcon && (
										<TypeIcon className="size-4 text-muted-foreground" />
									)}
									{!TypeIcon && (
										<Image
											src={`https://thesvg.org/icons/${typeConfig.icon.toLowerCase()}/default.svg`}
											alt="File"
											width={24}
											height={24}
										/>
									)}
								</AttachmentMedia>

								<AttachmentContent>
									<AttachmentTitle title={doc.title}>
										<motion.span layoutId={`doc-title-${doc.id}`}>
											{doc.title}
										</motion.span>
									</AttachmentTitle>

									<AttachmentDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
										<span className="flex items-center gap-1">
											<Calendar className="size-3" />
											{formatDate(doc.createdAt)}
										</span>
										{doc.fileSize && (
											<span className="flex items-center gap-1">
												<HardDrive className="size-3" />
												{formatBytes(doc.fileSize)}
											</span>
										)}
										{doc.pageCount && (
											<span className="flex items-center gap-1">
												<Layers className="size-3" />
												{doc.pageCount} {doc.pageCount === 1 ? "page" : "pages"}
											</span>
										)}
									</AttachmentDescription>
								</AttachmentContent>

								<AttachmentActions>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<AttachmentAction
												variant="ghost"
												size="icon"
												className="text-muted-foreground"
											>
												<MoreVertical className="size-4" />
											</AttachmentAction>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-full"
										>
											<DropdownMenuGroup>
												{doc.url && (
													<DropdownMenuItem
														onClick={() => window.open(doc.url, "_blank")}
													>
														<ExternalLink />
														Open original
													</DropdownMenuItem>
												)}
												<DropdownMenuItem
													onClick={() =>
														setPreviewDoc({
															id: doc.id,
															title: doc.title,
															url: doc.url,
															fileType: doc.fileType
														})
													}
												>
													<IconEyeFilled />
													Preview Document
												</DropdownMenuItem>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<DropdownMenuItem
															onSelect={(e) => e.preventDefault()}
															variant="destructive"
														>
															<Trash2 />
															Delete
														</DropdownMenuItem>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Delete Document
															</AlertDialogTitle>
															<AlertDialogDescription>
																Are you sure you want to delete &quot;
																{doc.title}
																&quot;? This action cannot be undone.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() =>
																	deleteDocMutation.mutate({
																		key: doc.fileKey,
																	})
																}
																className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
															>
																Delete
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</DropdownMenuGroup>
										</DropdownMenuContent>
									</DropdownMenu>
								</AttachmentActions>

								<AttachmentTrigger
									onClick={() => handleOpenChat(doc.id, doc.title)}
									disabled={getOrCreateChatMutation.isPending}
								/>
							</Attachment>
						);
					})}
				</div>
			)}

			{/* Fullscreen Preview — forced to near-viewport width; the component's
			    own default (sm:max-w-lg) would otherwise win and squeeze this down. */}
			<Dialog
				open={!!previewDoc}
				onOpenChange={(open) => !open && setPreviewDoc(null)}
			>
				<DialogContent
					showCloseButton={false}
					className="max-w-none! w-[96vw] sm:w-[92vw] h-[92vh] sm:h-[90vh] flex flex-col p-0 gap-0"
				>
					<DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 border-b">
						<DialogTitle className="flex items-center gap-2 truncate pr-8">
							<Files className="size-4 text-primary shrink-0" />
							<motion.span
								layoutId={`doc-title-${previewDoc?.id}`}
								className="truncate"
							>
								{previewDoc?.title}
							</motion.span>
						</DialogTitle>
						<div className="flex items-center justify-center gap-2">
							{previewDoc?.url && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => window.open(previewDoc.url, "_blank")}
									className="gap-1.5 self-start"
								>
									<ExternalLink className="size-3.5" />
									Open original
								</Button>
							)}
							<DialogClose asChild>
								<Button variant="ghost">
									<IconX />
								</Button>
							</DialogClose>
						</div>
					</DialogHeader>
					<div className="flex-1 bg-neutral-900 min-h-0">
						{previewDoc && isUrlExpired(previewDoc.url) ? (
							<div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center px-6">
								<Files className="size-10 text-muted-foreground/50" />
								<div>
									<p className="text-sm font-medium text-white">
										This preview link has expired
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										Close this and reopen the document to get a fresh link.
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPreviewDoc(null)}
								>
									Close
								</Button>
							</div>
						) : (
							previewDoc?.url && (
								<iframe
									src={
										previewDoc.fileType === "DOCX"
											? `https://docs.google.com/gview?url=${encodeURIComponent(previewDoc.url)}&embedded=true`
											: previewDoc.fileType === "PDF"
												? `${previewDoc.url}#toolbar=0&navpanes=0`
												: previewDoc.url
									}
									title={previewDoc.title}
									className="w-full h-full border-0"
								/>
							)
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
