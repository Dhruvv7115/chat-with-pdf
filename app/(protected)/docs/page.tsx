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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
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
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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

// Reads expiry off a presigned URL without a network round-trip.
// Supports AWS SigV4 (X-Amz-Date + X-Amz-Expires) and generic Unix-timestamp
// "Expires" params (GCS, some CDNs). Unknown/unparseable formats are treated
// as "not expired" here — the iframe's onError is the fallback for those.
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
				icon: FileText,
			};
		case "DOCX":
			return {
				label: "DOCX",
				tint: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
				icon: FileCode2,
			};
		case "MARKDOWN":
		case "MD":
			return {
				label: "MARKDOWN",
				tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
				icon: FileCode,
			};
		default:
			return {
				label: fileType || "DOCUMENT",
				tint: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
				icon: FileTypeIcon,
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
		title: string;
		url: string;
		fileType?: string;
	} | null>(null);
	// Doc ids whose iframe failed to load at runtime (e.g. a non-standard
	// presigned URL that expired but wasn't caught by isUrlExpired).
	const [failedPreviewIds, setFailedPreviewIds] = useState<Set<string>>(
		new Set(),
	);
	// Forces expiry to be re-evaluated periodically for long-open tabs.
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
		<div className="p-6 mx-auto space-y-6 w-full min-h-full bg-sidebar">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
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
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<Tabs
					value={activeCategory}
					onValueChange={(v) => setActiveCategory(v as FileCategory)}
				>
					<TabsList className="h-auto flex-wrap gap-1.5 p-1">
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
											? "bg-primary/10 text-primary font-bold"
											: "bg-muted-foreground/15 text-muted-foreground",
									)}
								>
									{cat.count}
								</Badge>
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				{/* Search trigger — opens the Command palette */}
				<Button
					variant="outline"
					onClick={() => setCommandOpen(true)}
					className="w-full md:w-72 justify-between text-muted-foreground font-normal bg-background"
				>
					<span className="flex items-center gap-2">
						<SearchIcon className="size-4" />
						Search documents...
					</span>
					<kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
						⌘K
					</kbd>
				</Button>
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
							const TypeIcon = typeConfig.icon;
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
									<TypeIcon className="size-4 text-muted-foreground" />
									<span className="truncate">{doc.title}</span>
									<CommandShortcut>{typeConfig.label}</CommandShortcut>
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</CommandDialog>

			{/* Loading Skeletons */}
			{isLoading && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Card
							key={i}
							className="overflow-hidden py-0"
						>
							<CardHeader className="p-4 space-y-2 border-b bg-muted/30">
								<div className="flex items-center gap-2">
									<Skeleton className="size-7 rounded" />
									<Skeleton className="h-4 w-2/3" />
								</div>
								<div className="flex gap-2">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-20" />
								</div>
							</CardHeader>
							<Skeleton className="h-48 w-full rounded-none" />
							<CardFooter className="p-3 flex justify-between gap-2">
								<Skeleton className="h-8 w-24" />
								<Skeleton className="h-8 w-24" />
							</CardFooter>
						</Card>
					))}
				</div>
			)}

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

			{/* Document Grid View */}
			{!isLoading && filteredDocs.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredDocs.map((doc) => {
						const typeConfig = getFileTypeConfig(doc.fileType);
						const TypeIcon = typeConfig.icon;

						return (
							<Card
								key={doc.id}
								className="group py-0 overflow-hidden border-border/70 hover:border-primary/40 hover:shadow-md transition-all duration-200"
							>
								{/* Card Header */}
								<CardHeader className="p-4 border-b bg-muted/30 space-y-2 gap-0">
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2 min-w-0">
											<div
												className={cn(
													"p-1.5 rounded border shrink-0",
													typeConfig.tint,
												)}
											>
												<TypeIcon className="size-4" />
											</div>
											<h2
												className="font-semibold text-sm text-foreground truncate"
												title={doc.title}
											>
												{doc.title}
											</h2>
										</div>

										{/* Overflow actions */}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="size-7 text-muted-foreground shrink-0"
												>
													<MoreVertical className="size-3.5" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuGroup>
													{doc.url && (
														<DropdownMenuItem
															onClick={() => window.open(doc.url, "_blank")}
														>
															<ExternalLink />
															Open original
														</DropdownMenuItem>
													)}
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
									</div>

									{/* Metadata */}
									<div className="flex flex-wrap items-center gap-1.5 pt-1">
										<Badge
											variant="outline"
											className={cn(
												"text-[10px] font-bold uppercase",
												typeConfig.tint,
											)}
										>
											{typeConfig.label}
										</Badge>
										<Badge
											variant="outline"
											className="text-[10px] font-normal gap-1 text-muted-foreground"
										>
											<Calendar className="size-3" />
											{formatDate(doc.createdAt)}
										</Badge>
										{doc.fileSize && (
											<Badge
												variant="outline"
												className="text-[10px] font-normal gap-1 text-muted-foreground"
											>
												<HardDrive className="size-3" />
												{formatBytes(doc.fileSize)}
											</Badge>
										)}
										{doc.pageCount && (
											<Badge
												variant="outline"
												className="text-[10px] font-normal gap-1 text-muted-foreground"
											>
												<Layers className="size-3" />
												{doc.pageCount} {doc.pageCount === 1 ? "page" : "pages"}
											</Badge>
										)}
									</div>
								</CardHeader>

								{/* Thumbnail: real presigned-URL preview when the link is still
								    valid, tinted placeholder when it's expired, missing, or failed
								    to load at runtime. */}
								{(() => {
									// biome-ignore lint: expiryTick is a deliberate re-render trigger
									void expiryTick;
									const expired = isUrlExpired(doc.url);
									const failed = failedPreviewIds.has(doc.id);
									const showPlaceholder = !doc.url || expired || failed;

									let iframeSrc = doc.url ?? "";
									if (doc.fileType === "PDF") {
										iframeSrc = `${doc.url}#toolbar=0&navpanes=0`;
									} else if (doc.fileType === "DOCX") {
										iframeSrc = `https://docs.google.com/gview?url=${encodeURIComponent(doc.url ?? "")}&embedded=true`;
									}

									return (
										<div className="relative w-full h-48 border-b overflow-hidden bg-muted/20">
											{showPlaceholder ? (
												<div
													className={cn(
														"w-full h-full flex flex-col justify-center items-center",
														typeConfig.tint,
													)}
												>
													<TypeIcon className="size-14 opacity-30" />
													<span className="mt-3 text-xs text-muted-foreground px-4 text-center">
														{!doc.url
															? "Preview unavailable"
															: "Preview link expired — reopen to refresh"}
													</span>
												</div>
											) : (
												<iframe
													src={iframeSrc}
													title={doc.title}
													className="w-full h-full border-0 pointer-events-none"
													onError={() =>
														setFailedPreviewIds((prev) =>
															new Set(prev).add(doc.id),
														)
													}
												/>
											)}
											{doc.url && !showPlaceholder && (
												<button
													type="button"
													onClick={() =>
														setPreviewDoc({
															title: doc.title,
															url: doc.url,
															fileType: doc.fileType,
														})
													}
													className="absolute inset-0 flex items-end justify-end p-2 bg-transparent group-hover:bg-black/10 transition-colors"
												>
													<span className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
														<Maximize2 className="size-3.5" />
														Expand
													</span>
												</button>
											)}
										</div>
									);
								})()}

								{/* Card Footer Actions */}
								<CardFooter className="p-3 gap-2">
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													doc.url && window.open(doc.url, "_blank")
												}
												disabled={!doc.url}
												className="size-8"
											>
												<ExternalLink className="size-3.5" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Open original file</TooltipContent>
									</Tooltip>
									<Button
										size="sm"
										onClick={() => handleOpenChat(doc.id, doc.title)}
										disabled={getOrCreateChatMutation.isPending}
										className="gap-1.5 text-xs h-8 flex-1 font-medium"
									>
										<MessageSquare className="size-3.5" />
										Chat with Doc
									</Button>
								</CardFooter>
							</Card>
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
				<DialogContent className="!max-w-none w-[96vw] sm:w-[92vw] h-[92vh] sm:h-[90vh] flex flex-col p-0 gap-0">
					<DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 border-b space-y-0">
						<DialogTitle className="flex items-center gap-2 truncate pr-8">
							<Files className="size-4 text-primary shrink-0" />
							<span className="truncate">{previewDoc?.title}</span>
						</DialogTitle>
						{previewDoc?.url && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => window.open(previewDoc.url, "_blank")}
								className="gap-1.5 self-start sm:self-auto sm:mr-8"
							>
								<ExternalLink className="size-3.5" />
								Open original
							</Button>
						)}
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
