import { useRef, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

const ReactPdf = ({ pdfUrl }: { pdfUrl: string }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState<number>();
	const [numPages, setNumPages] = useState<number>();
	const [pageNumber, setPageNumber] = useState(1);
	const [showPagination, setShowPagination] = useState<boolean>(false);

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			setContainerWidth(entries[0].contentRect.width);
		});

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={containerRef}
			className="h-full overflow-y-auto flex flex-col items-center relative"
			onMouseEnter={() => setShowPagination(true)}
			onMouseLeave={() => setShowPagination(false)}
		>
			<Document
				file={pdfUrl}
				onLoadSuccess={({ numPages }) => setNumPages(numPages)}
			>
				<Page
					pageNumber={pageNumber}
					width={containerWidth ? containerWidth - 32 : undefined}
				/>
			</Document>

			<Pagination
				className={cn(
					"sticky bottom-8 z-50 bg-white dark:bg-neutral-900 w-fit p-1 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-800",
					showPagination && numPages && pageNumber && numPages > 1
						? ""
						: "hidden",
				)}
			>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
							className={pageNumber <= 1 ? " opacity-40" : "cursor-pointer"}
						/>
					</PaginationItem>
					<PaginationItem>
						<span className="text-sm font-medium px-2">
							<span className="text-primary font-bold">{pageNumber}</span>
							<span className="text-muted-foreground"> / {numPages}</span>
						</span>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							onClick={() =>
								setPageNumber((p) => Math.min(p + 1, numPages || 1))
							}
							className={
								pageNumber >= (numPages || 1)
									? "pointer-events-none opacity-40"
									: "cursor-pointer"
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};
export default ReactPdf;
