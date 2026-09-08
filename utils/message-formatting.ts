export function escapeCurrencyDollars(text: string): string {
	// Escape $ that's immediately followed by digits (currency), not math
	return text.replace(/\$(?=\d)/g, "\\$");
}

export function linkifyPageCitations(text: string): string {
	return text.replace(
		/\[p\.\s*(\d+(?:\s*,\s*\d+)*)\]/g,
		(match, pages: string) => {
			const pageNumbers = pages.split(",").map((p) => p.trim());
			return pageNumbers.map((page) => `[p.${page}](#page-${page})`).join("");
		},
	);
}

export function formatMessageContent(text: string): string {
	return linkifyPageCitations(escapeCurrencyDollars(text));
}
