import { useRef, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

const RESIZE_SETTLE_MS = 150;

const ReactPdf = ({ docUrl }: { docUrl: string }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	// liveWidth updates on every resize tick — used only for the CSS scale factor
	const [liveWidth, setLiveWidth] = useState<number>();
	// renderWidth only updates after resize settles — this is what actually
	// gets passed to <Page>, triggering a real re-render/re-rasterization
	const [renderWidth, setRenderWidth] = useState<number>();

	const [numPages, setNumPages] = useState<number>();
	const [pageNumber, setPageNumber] = useState(1);
	const [showPagination, setShowPagination] = useState<boolean>(false);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		const observer = new ResizeObserver((entries) => {
			const width = entries[0].contentRect.width;

			// update instantly for smooth CSS-scaled visual tracking
			setLiveWidth(width);

			// only commit a real re-render once movement stops
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				setRenderWidth(width);
			}, RESIZE_SETTLE_MS);
		});

		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			observer.disconnect();
			clearTimeout(timeoutId);
		};
	}, []);

	// on first mount, renderWidth needs an initial value too — sync it once
	useEffect(() => {
		if (liveWidth && renderWidth === undefined) {
			setRenderWidth(liveWidth);
		}
	}, [liveWidth, renderWidth]);

	const pageWidth = renderWidth ? renderWidth - 32 : undefined;

	// scale factor: how much bigger/smaller the live container is vs.
	// the width the canvas was actually rendered at
	const scale =
		pageWidth && liveWidth && renderWidth ? (liveWidth - 32) / pageWidth : 1;

	return (
		<div
			ref={containerRef}
			className="h-full overflow-y-auto flex flex-col items-center relative"
			onMouseEnter={() => setShowPagination(true)}
			onMouseLeave={() => setShowPagination(false)}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					transformOrigin: "top center",
				}}
			>
				<Document
					file={docUrl ?? ""}
					onLoadSuccess={({ numPages }) => setNumPages(numPages)}
				>
					<Page
						pageNumber={pageNumber}
						width={pageWidth}
					/>
				</Document>
			</div>

			<Pagination
				className={cn(
					"sticky bottom-8 z-50 bg-white dark:bg-neutral-900 w-fit p-1 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-800",
					showPagination && numPages && pageNumber ? "" : "hidden",
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
