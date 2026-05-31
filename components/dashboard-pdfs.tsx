"use client";

import { api } from "@/trpc/client";
import Link from "next/link";
import {
	IconFileDescription,
	IconMessageChatbotFilled,
} from "@tabler/icons-react";

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function DashboardPdfs() {
	const { data: pdfs, isLoading } = api.pdf.getUserPdfs.useQuery();

	return (
		<div className="border border-border rounded-xl p-5 bg-background">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
					Recent PDFs
				</h2>
				<Link
					href="/pdfs"
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
							<div className="w-8 h-10 bg-muted rounded" />
							<div className="flex-1 space-y-1.5">
								<div className="h-3 bg-muted rounded w-3/4" />
								<div className="h-2.5 bg-muted rounded w-1/3" />
							</div>
						</div>
					))}
				</div>
			)}

			{!isLoading && (!pdfs || pdfs.length === 0) && (
				<div className="flex flex-col items-center justify-center py-8 text-center">
					<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
						<IconFileDescription className="text-neutral-300" />
					</div>
					<p className="text-sm text-muted-foreground">No PDFs uploaded yet</p>
					<Link
						href="/upload"
						className="mt-2 text-xs text-blue-500 hover:underline"
					>
						Upload your first PDF
					</Link>
				</div>
			)}

			{!isLoading && pdfs && pdfs.length > 0 && (
				<ul className="divide-y divide-border">
					{pdfs.slice(0, 5).map((pdf) => (
						<li
							key={pdf.id}
							className="flex items-center gap-3 py-2.5"
						>
							<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
								<IconFileDescription className="text-neutral-400" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">{pdf.title}</p>
								<p className="text-xs text-muted-foreground">
									{formatDate(pdf.createdAt)}
									{pdf.pageCount ? ` · ${pdf.pageCount} pages` : ""}
									{pdf.fileSize
										? ` · ${(pdf.fileSize / 1024 / 1024).toFixed(1)} MB`
										: ""}
								</p>
							</div>
							<Link
								href={`/chat?pdfId=${pdf.id}`}
								className="shrink-0 text-xs bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md px-2.5 py-1 transition-colors"
							>
								Chat →
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
