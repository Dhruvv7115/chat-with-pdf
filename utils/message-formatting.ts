export function escapeCurrencyDollars(text: string): string {
	// Escape $ that's immediately followed by digits (currency), not math
	return text.replace(/\$(?=\d)/g, "\\$");
}

export function linkifyPageCitations(text: string): string {
	return text.replace(
		/\[p\.(\d+)\]/g,
		(_, page) => `[p.${page}](#page-${page})`,
	);
}

export function formatMessageContent(text: string): string {
	return linkifyPageCitations(escapeCurrencyDollars(text));
}
