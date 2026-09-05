"use client";

import React from "react";
import {
	BookmarkIcon,
	FileTextIcon,
	SparklesIcon,
	ExternalLinkIcon,
	SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PageCitationsCard({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center min-h-150 md:min-h-125 p-0.5 relative group cursor-pointer max-h-100 group border-t border-l-0 md:border-l md:border-t-0 border-border",
				className,
			)}
		>
			{/* Top Demo: Document Viewer + Floating AI Citation */}
			<div className="w-full h-full p-4 flex flex-col items-center justify-center gap-5 relative">
				{/* Subtle background grid pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_at_center,black_50%,transparent_90%)] opacity-25" />

				{/* Mock PDF Sheet peeking behind */}
				<div className="relative w-full flex items-center justify-start px-4 md:px-8">
					<div className="max-w-85 shadow-lg shadow-black/5 dark:shadow-black/20 border border-border/80 rounded-lg  bg-background">
						{/* Document Mini-Header */}
						<div className="flex items-center justify-between border-b border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
							<div className="flex items-center gap-1.5 font-medium text-foreground">
								<FileTextIcon className="size-3 text-lime-600 dark:text-lime-400" />
								<span className="truncate max-w-35">Q3_Report_2025.pdf</span>
							</div>
							<div className="flex items-center gap-2 text-[10px]">
								<span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
									<SearchIcon className="size-2.5" /> 8.4M
								</span>
								<span className="font-mono text-foreground font-semibold">
									p. 14
								</span>
							</div>
						</div>

						{/* Document Content Skeleton with highlighted passage */}
						<div className="space-y-2 p-3 text-[11px] leading-relaxed">
							<div className="h-2 w-3/4 rounded bg-muted-foreground/15" />
							<div className="h-2 w-full rounded bg-muted-foreground/10" />

							{/* Simulated Highlighted PDF Excerpt */}
							<div className="relative rounded-md border border-lime-500/30 bg-lime-500/10 px-2 py-1.5 text-xs text-foreground transition-colors group-hover:bg-lime-500/15">
								<div className="absolute -left-1 top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-lime-500" />
								<span className="font-medium">
									"...the European division reported{" "}
									<mark className="rounded bg-lime-400/40 dark:bg-lime-400/30 px-0.5 text-foreground">
										€8.4M in net revenue
									</mark>{" "}
									for Q3..."
								</span>
							</div>

							<div className="h-2 w-5/6 rounded bg-muted-foreground/10" />
						</div>
					</div>
				</div>

				{/* Floating AI Answer Bubble Overlapping the Document */}
				<div className="flex items-center justify-end w-full px-4 md:px-8">
					<div className="max-w-65 rounded-xl border border-border/90 bg-background/95 p-3 shadow-xl backdrop-blur-md transition-transform duration-200 group-hover:-translate-y-1">
						<div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground mb-1.5">
							<div className="flex items-center gap-1 font-semibold text-foreground">
								<SparklesIcon className="size-3 text-lime-600 dark:text-lime-400" />
								<span>Extracted Source</span>
							</div>
							<span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/80">
								98% match
							</span>
						</div>

						<p className="text-[11px] leading-snug text-foreground/90">
							European Q3 net revenue hit €8.4M (+12% QoQ).
						</p>

						<div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2">
							<button
								type="button"
								className="inline-flex items-center gap-1 rounded-md bg-lime-500/10 px-2 py-0.5 text-[10px] font-semibold text-lime-700 dark:text-lime-300 border border-lime-500/20 hover:bg-lime-500/20 transition-colors"
							>
								<BookmarkIcon className="size-2.5 fill-current" />
								<span>Jump to Page 14</span>
								<ExternalLinkIcon className="size-2.5 opacity-70" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Text at Bottom */}
			<div className="flex-1 flex-col gap-2 p-6">
				<h3 className="text-lg tracking-tighter font-semibold">
					Page-cited answers
				</h3>
				<p className="text-muted-foreground">
					Click any citation tag to jump directly to the exact paragraph and
					verified table inside your PDF.
				</p>
			</div>
		</div>
	);
}

export default PageCitationsCard;
