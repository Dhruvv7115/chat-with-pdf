"use client";

import { useState } from "react";
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

export default function PdfsPage() {
	const router = useRouter();
	const utils = api.useUtils();
	const [searchQuery, setSearchQuery] = useState("");
	const [previewPdf, setPreviewPdf] = useState<{ title: string; url: string } | null>(null);

	const { data: pdfs, isLoading } = api.pdf.getAllUserPdfsWithUrls.useQuery();

	const deletePdfMutation = api.pdf.deleteFile.useMutation({
		onSuccess: () => {
			toast.success("PDF deleted successfully");
			utils.pdf.getAllUserPdfsWithUrls.invalidate();
			utils.pdf.getUserPdfs.invalidate();
		},
		onError: (err) => {
			toast.error(err.message || "Failed to delete PDF");
		},
	});

	const createChatMutation = api.chat.createChat.useMutation({
		onError: (err) => {
			toast.error(err.message || "Failed to create chat");
		},
	});

	const handleStartChat = async (pdfId: string, pdfTitle: string) => {
		try {
			const chat = await createChatMutation.mutateAsync({
				title: pdfTitle,
				pdfId,
			});
			router.push(`/chat/${chat.id}`);
		} catch (error) {
			console.error("Failed to start chat:", error);
		}
	};

	const filteredPdfs = pdfs?.filter((pdf) =>
		pdf.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6 w-full min-h-full">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
				<div>
					<div className="flex items-center gap-2.5">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">
							Uploaded PDFs
						</h1>
						{pdfs && (
							<Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold">
								{pdfs.length} {pdfs.length === 1 ? "file" : "files"}
							</Badge>
						)}
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						View, preview with S3 presigned URLs, chat with, or manage all your uploaded PDF documents.
					</p>
				</div>

				<Link href="/chat">
					<Button className="gap-2 shadow-sm font-medium">
						<Plus className="h-4 w-4" />
						Upload New PDF
					</Button>
				</Link>
			</div>

			{/* Search Filter Toolbar */}
			<div className="flex items-center gap-3">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search PDFs by title..."
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

			{/* Loading Skeleton */}
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
			{!isLoading && pdfs?.length === 0 && (
				<div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-muted rounded-xl bg-card">
					<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
						<FileCode className="h-8 w-8" />
					</div>
					<h3 className="text-lg font-semibold text-foreground">No PDFs uploaded yet</h3>
					<p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
						Upload your first PDF document to preview it here and start asking AI questions about it.
					</p>
					<Link href="/chat">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Upload PDF Now
						</Button>
					</Link>
				</div>
			)}

			{/* Search No Results */}
			{!isLoading && pdfs && pdfs.length > 0 && filteredPdfs?.length === 0 && (
				<div className="text-center py-12 border rounded-xl bg-card">
					<p className="text-muted-foreground">
						No PDFs found matching &quot;{searchQuery}&quot;
					</p>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSearchQuery("")}
						className="mt-2 text-xs"
					>
						Clear search filter
					</Button>
				</div>
			)}

			{/* PDF Grid View */}
			{!isLoading && filteredPdfs && filteredPdfs.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredPdfs.map((pdf) => (
						<div
							key={pdf.id}
							className="group relative flex flex-col border border-border/70 hover:border-primary/40 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
						>
							{/* Card Header */}
							<div className="p-4 border-b bg-muted/30 space-y-1.5">
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-center gap-2 min-w-0">
										<div className="p-1.5 rounded bg-primary/10 text-primary shrink-0">
											<FileText className="h-4 w-4" />
										</div>
										<h2
											className="font-semibold text-sm text-foreground truncate"
											title={pdf.title}
										>
											{pdf.title}
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
												<AlertDialogTitle>Delete PDF</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to delete &quot;{pdf.title}&quot;? This action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => deletePdfMutation.mutate({ key: pdf.fileKey })}
													className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>

								{/* Metadata Badges */}
								<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
									<span className="flex items-center gap-1">
										<Calendar className="h-3 w-3" />
										{formatDate(pdf.createdAt)}
									</span>
									{pdf.fileSize && (
										<span className="flex items-center gap-1">
											<HardDrive className="h-3 w-3" />
											{formatBytes(pdf.fileSize)}
										</span>
									)}
									{pdf.pageCount && (
										<span className="flex items-center gap-1">
											<Layers className="h-3 w-3" />
											{pdf.pageCount} {pdf.pageCount === 1 ? "page" : "pages"}
										</span>
									)}
								</div>
							</div>

							{/* Iframe Presigned URL Preview Container */}
							<div className="relative w-full h-[320px] bg-neutral-900/5 dark:bg-neutral-950 flex flex-col justify-center items-center overflow-hidden border-b">
								{pdf.url ? (
									<>
										<iframe
											src={`${pdf.url}#toolbar=0&navpanes=0`}
											title={pdf.title}
											className="w-full h-full border-0"
										/>
										<button
											onClick={() => setPreviewPdf({ title: pdf.title, url: pdf.url })}
											className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow"
											title="Expand preview"
										>
											<Maximize2 className="h-4 w-4" />
										</button>
									</>
								) : (
									<div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
										<FileText className="h-10 w-10 mb-2 opacity-40" />
										<p className="text-xs">Preview unavailable</p>
									</div>
								)}
							</div>

							{/* Card Footer Actions */}
							<div className="p-3 bg-card flex items-center justify-between gap-2 mt-auto">
								{pdf.url && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => window.open(pdf.url, "_blank")}
										className="gap-1.5 text-xs h-8"
									>
										<ExternalLink className="h-3.5 w-3.5" />
										Open Link
									</Button>
								)}
								<Button
									size="sm"
									onClick={() => handleStartChat(pdf.id, pdf.title)}
									disabled={createChatMutation.isPending}
									className="gap-1.5 text-xs h-8 ml-auto"
								>
									<MessageSquare className="h-3.5 w-3.5" />
									Chat
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Fullscreen Iframe Modal */}
			{previewPdf && (
				<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-4 md:p-8">
					<div className="flex items-center justify-between pb-4 text-white">
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-primary" />
							<h3 className="font-semibold text-lg truncate max-w-xl">
								{previewPdf.title}
							</h3>
						</div>
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="sm"
								onClick={() => window.open(previewPdf.url, "_blank")}
								className="text-black border-white/20 hover:bg-white/70 bg-white gap-1.5"
							>
								<ExternalLink className="h-4 w-4" />
								Open original
							</Button>
							<button
								onClick={() => setPreviewPdf(null)}
								className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
							>
								<X className="h-6 w-6" />
							</button>
						</div>
					</div>
					<div className="flex-1 w-full h-full rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
						<iframe
							src={previewPdf.url}
							title={previewPdf.title}
							className="w-full h-full border-0"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
