import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Doc } from "./chat-ai";

const MarkdownViewer = ({ docUrl, doc }: { docUrl: string; doc: Doc }) => {
	const [markdown, setMarkdown] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadContent() {
			try {
				setLoading(true);
				const res = await fetch(
					`/api/documents/preview?url=${encodeURIComponent(docUrl)}&fileType=${doc.fileType}`,
				);
				if (!res.ok) throw new Error("Failed to load preview");
				const { markdown } = await res.json();
				setMarkdown(markdown);
			} catch (err) {
				setError("Could not load document preview");
			} finally {
				setLoading(false);
			}
		}
		loadContent();
	}, [docUrl]);

	if (loading)
		return <div className="p-8 text-muted-foreground">Loading preview...</div>;
	if (error) return <div className="p-8 text-red-500">{error}</div>;

	return (
		<div className="h-full overflow-y-auto p-8 typeset typeset-docs max-w-none">
			<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
		</div>
	);
};

export default MarkdownViewer;
