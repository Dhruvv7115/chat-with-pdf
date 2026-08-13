import { FileType } from "@/lib/generated/prisma/enums";

export function getFileType(file: File): FileType | null {
	const ext = file.name.split(".").pop()?.toLowerCase();

	const map: Record<string, FileType> = {
		pdf: "PDF",
		docx: "DOCX",
		doc: "DOCX",
		md: "MARKDOWN",
		markdown: "MARKDOWN",
		txt: "TXT",
		csv: "TXT", // or add a CSV variant to your enum if you want to treat it separately
	};

	return ext ? (map[ext] ?? null) : null;
}
