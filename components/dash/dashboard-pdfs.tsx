"use client";

import { api } from "@/trpc/client";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
					Recent Documents
				</CardTitle>
				<Button
					variant="link"
					size="sm"
					className="h-auto p-0 text-xs"
					asChild
				>
					<Link href="/docs">View all</Link>
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
								<Skeleton className="h-10 w-8 rounded" />
								<div className="flex-1 flex flex-col gap-1.5">
									<Skeleton className="h-3 w-3/4" />
									<Skeleton className="h-2.5 w-1/3" />
								</div>
							</div>
						))}
					</div>
				)}

				{!isLoading && (!pdfs || pdfs.length === 0) && (
					<div className="flex flex-col items-center justify-center py-8 text-center gap-3">
						<div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
							<FileText className="size-5" />
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-sm text-muted-foreground">
								No documents uploaded yet
							</p>
						</div>
						<Button
							variant="link"
							size="sm"
							className="h-auto p-0 text-xs"
							asChild
						>
							<Link href="/chat">Upload your first document</Link>
						</Button>
					</div>
				)}

				{!isLoading && pdfs && pdfs.length > 0 && (
					<div className="flex flex-col">
						{pdfs.slice(0, 5).map((pdf, i) => (
							<div key={pdf.id}>
								<div className="flex items-center gap-3 py-2.5">
									<span className="flex items-center justify-center size-10 rounded-lg bg-muted text-muted-foreground shrink-0">
										<FileText className="size-4" />
									</span>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{pdf.title}</p>
										<p className="text-xs text-muted-foreground truncate">
											{formatDate(pdf.createdAt)}
											{pdf.pageCount ? ` · ${pdf.pageCount} pages` : ""}
											{pdf.fileSize
												? ` · ${(pdf.fileSize / 1024 / 1024).toFixed(1)} MB`
												: ""}
										</p>
									</div>
									<Button
										variant="secondary"
										size="sm"
										className="h-7 gap-1 text-xs shrink-0"
										asChild
									>
										<Link href={`/chat?pdfId=${pdf.id}`}>
											Chat
											<ArrowRight className="size-3" />
										</Link>
									</Button>
								</div>
								{i < pdfs.slice(0, 5).length - 1 && <Separator />}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
