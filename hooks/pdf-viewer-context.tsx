"use client";

import {
	createContext,
	useContext,
	useState,
	Dispatch,
	SetStateAction,
	ReactNode,
} from "react";

interface PdfViewerContextValue {
	pageNumber: number;
	setPageNumber: Dispatch<SetStateAction<number>>;
}

const PdfViewerContext = createContext<PdfViewerContextValue | null>(null);

export function PdfViewerProvider({ children }: { children: ReactNode }) {
	const [pageNumber, setPageNumber] = useState(1);
	return (
		<PdfViewerContext.Provider value={{ pageNumber, setPageNumber }}>
			{children}
		</PdfViewerContext.Provider>
	);
}

export function usePdfViewer() {
	const ctx = useContext(PdfViewerContext);
	if (!ctx)
		throw new Error("usePdfViewer must be used within PdfViewerProvider");
	return ctx;
}
