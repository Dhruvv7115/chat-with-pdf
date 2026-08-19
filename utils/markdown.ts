export function extractTextFromCode(node: any): string {
	if (typeof node === "string") return node;
	if (Array.isArray(node)) return node.map(extractTextFromCode).join("");
	if (node?.props?.children) return extractTextFromCode(node.props.children);
	return "";
}
