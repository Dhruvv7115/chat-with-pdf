export function escapeCurrencyDollars(text: string): string {
	// Escape $ that's immediately followed by digits (currency), not math
	return text.replace(/\$(?=\d)/g, "\\$");
}
