"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import {
	FileText,
	Search,
	MessageSquare,
	ExternalLink,
	Trash2,
	Maximize2,
	Plus,
	X,
	Calendar,
	HardDrive,
	Layers,
	FileCode,
	FileCode2,
	Files,
	FileType as FileTypeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

function getFileTypeConfig(fileType?: string) {
	switch (fileType?.toUpperCase()) {
		case "PDF":
			return {
				label: "PDF",
				color:
					"bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
				icon: FileText,
				badgeColor: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
			};
		case "DOCX":
			return {
				label: "DOCX",
				color:
					"bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
				icon: FileCode2,
				badgeColor:
					"bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
			};
		case "MARKDOWN":
		case "MD":
			return {
				label: "MARKDOWN",
				color:
					"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
				icon: FileCode,
				badgeColor:
					"bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
			};
		default:
			return {
				label: fileType || "DOCUMENT",
				color:
					"bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
				icon: FileTypeIcon,
				badgeColor:
					"bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
			};
	}
}

export default function DocsPage() {
	const router = useRouter();
	const utils = api.useUtils();
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState<FileCategory>("ALL");
	const [previewDoc, setPreviewDoc] = useState<{
		title: string;
		url: string;
		fileType?: string;
	} | null>(null);

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

	// Filter documents by search and category tab
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
						View, preview with presigned URLs, chat with, and manage your
						separated PDF, Word, and Markdown documents.
					</p>
				</div>

				<Link href="/chat">
					<Button className="gap-2 shadow-sm font-medium">
						<Plus className="h-4 w-4" />
						Upload New Document
					</Button>
				</Link>
			</div>

			{/* Category Filter Tabs & Search Toolbar */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				{/* File Type Tabs */}
				<div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-xl border">
					{categories.map((cat) => (
						<button
							key={cat.id}
							onClick={() => setActiveCategory(cat.id)}
							className={cn(
								"flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
								activeCategory === cat.id
									? "bg-background text-foreground shadow-sm font-semibold"
									: "text-muted-foreground hover:text-foreground hover:bg-background/50",
							)}
						>
							{cat.label}
							<span
								className={cn(
									"px-1.5 py-0.2 rounded-full text-[10px]",
									activeCategory === cat.id
										? "bg-primary/10 text-primary font-bold"
										: "bg-muted-foreground/15 text-muted-foreground",
								)}
							>
								{cat.count}
							</span>
						</button>
					))}
				</div>

				{/* Search Input */}
				<div className="relative w-full md:w-72">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search documents by title..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 bg-background"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
			</div>

			{/* Loading Skeletons */}
			{isLoading && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="border rounded-xl p-4 bg-card shadow-sm space-y-4 animate-pulse"
						>
							<div className="flex items-center justify-between">
								<div className="h-5 bg-muted rounded w-1/2" />
								<div className="h-4 bg-muted rounded w-1/4" />
							</div>
							<div className="h-64 bg-muted rounded-lg w-full" />
							<div className="flex justify-between items-center pt-2">
								<div className="h-8 bg-muted rounded w-20" />
								<div className="h-8 bg-muted rounded w-20" />
							</div>
						</div>
					))}
				</div>
			)}

			{/* Empty State */}
			{!isLoading && docs?.length === 0 && (
				<div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-muted rounded-xl bg-card">
					<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
						<Files className="h-8 w-8" />
					</div>
					<h3 className="text-lg font-semibold text-foreground">
						No documents uploaded yet
					</h3>
					<p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
						Upload your PDF, Word, or Markdown documents to preview them here
						and start asking AI questions about them.
					</p>
					<Link href="/chat">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Upload Document Now
						</Button>
					</Link>
				</div>
			)}

			{/* Search / Tab Empty State */}
			{!isLoading && docs && docs.length > 0 && filteredDocs.length === 0 && (
				<div className="text-center py-12 border rounded-xl bg-card">
					<p className="text-muted-foreground">
						No documents found matching your filter criteria.
					</p>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setSearchQuery("");
							setActiveCategory("ALL");
						}}
						className="mt-2 text-xs"
					>
						Clear all filters
					</Button>
				</div>
			)}

			{/* Document Grid View */}
			{!isLoading && filteredDocs && filteredDocs.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredDocs.map((doc) => {
						const typeConfig = getFileTypeConfig(doc.fileType);
						const TypeIcon = typeConfig.icon;

						let iframeSrc = doc.url;
						if (doc.fileType === "PDF") {
							iframeSrc = `${doc.url}#toolbar=0&navpanes=0`;
						} else if (doc.fileType === "DOCX") {
							iframeSrc = `https://docs.google.com/gview?url=${encodeURIComponent(doc.url)}&embedded=true`;
						}

						return (
							<div
								key={doc.id}
								className="group relative flex flex-col border border-border/70 hover:border-primary/40 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
							>
								{/* Card Header */}
								<div className="p-4 border-b bg-muted/30 space-y-2">
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2 min-w-0">
											<div
												className={cn(
													"p-1.5 rounded border shrink-0",
													typeConfig.color,
												)}
											>
												<TypeIcon className="h-4 w-4" />
											</div>
											<h2
												className="font-semibold text-sm text-foreground truncate"
												title={doc.title}
											>
												{doc.title}
											</h2>
										</div>

										{/* Delete Action */}
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
												>
													<Trash2 className="h-3.5 w-3.5" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Delete Document</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete &quot;{doc.title}
														&quot;? This action cannot be undone.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															deleteDocMutation.mutate({ key: doc.fileKey })
														}
														className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>

									{/* Metadata Badges & Type Tag */}
									<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
										<span
											className={cn(
												"px-2 py-0.5 rounded text-[10px] font-bold uppercase",
												typeConfig.badgeColor,
											)}
										>
											{typeConfig.label}
										</span>
										<span className="flex items-center gap-1 text-[11px]">
											<Calendar className="h-3 w-3" />
											{formatDate(doc.createdAt)}
										</span>
										{doc.fileSize && (
											<span className="flex items-center gap-1 text-[11px]">
												<HardDrive className="h-3 w-3" />
												{formatBytes(doc.fileSize)}
											</span>
										)}
										{doc.pageCount && (
											<span className="flex items-center gap-1 text-[11px]">
												<Layers className="h-3 w-3" />
												{doc.pageCount} {doc.pageCount === 1 ? "page" : "pages"}
											</span>
										)}
									</div>
								</div>

								{/* Iframe Presigned URL Preview Container */}
								<div className="relative w-full h-80 bg-neutral-900/5 dark:bg-neutral-950 flex flex-col justify-center items-center overflow-hidden border-b">
									{doc.url ? (
										<>
											<iframe
												src={iframeSrc}
												title={doc.title}
												className="w-full h-full border-0 pointer-events-none"
											/>
											<button
												onClick={() =>
													setPreviewDoc({
														title: doc.title,
														url: doc.url,
														fileType: doc.fileType,
													})
												}
												className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow"
												title="Expand preview"
											>
												<Maximize2 className="h-4 w-4" />
											</button>
										</>
									) : (
										<div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
											<TypeIcon className="h-10 w-10 mb-2 opacity-40" />
											<p className="text-xs">Preview unavailable</p>
										</div>
									)}
								</div>

								{/* Card Footer Actions */}
								<div className="p-3 bg-card flex items-center justify-between gap-2 mt-auto">
									{doc.url && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => window.open(doc.url, "_blank")}
											className="gap-1.5 text-xs h-8"
										>
											<ExternalLink className="h-3.5 w-3.5" />
											Open Link
										</Button>
									)}
									<Button
										size="sm"
										onClick={() => handleOpenChat(doc.id, doc.title)}
										disabled={getOrCreateChatMutation.isPending}
										className="gap-1.5 text-xs h-8 ml-auto font-medium"
									>
										<MessageSquare className="h-3.5 w-3.5" />
										Chat with Doc
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Fullscreen Iframe Modal */}
			{previewDoc && (
				<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-4 md:p-8">
					<div className="flex items-center justify-between pb-4 text-white">
						<div className="flex items-center gap-2">
							<Files className="h-5 w-5 text-primary" />
							<h3 className="font-semibold text-lg truncate max-w-xl">
								{previewDoc.title}
							</h3>
						</div>
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="sm"
								onClick={() => window.open(previewDoc.url, "_blank")}
								className="text-black dark:text-white border-white/20 dark:border-black/20 hover:bg-white/80 dark:hover:bg-black/10 gap-1.5 cursor-pointer transition-all duration-300"
							>
								<ExternalLink className="h-4 w-4" />
								Open original
							</Button>
							<button
								onClick={() => setPreviewDoc(null)}
								className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
							>
								<X className="h-6 w-6" />
							</button>
						</div>
					</div>
					<div className="flex-1 w-full h-full rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
						<iframe
							src={
								previewDoc.fileType === "DOCX"
									? `https://docs.google.com/gview?url=${encodeURIComponent(previewDoc.url)}&embedded=true`
									: previewDoc.url
							}
							title={previewDoc.title}
							className="w-full h-full border-0"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
