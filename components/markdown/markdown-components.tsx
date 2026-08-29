import CodeBlockHeader from "@/components/markdown/code-block-header";
import { usePdfViewer } from "@/hooks/pdf-viewer-context";
import { extractTextFromCode } from "@/utils/markdown";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	oneDark,
	oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
export const customComponents = {
	pre: (props: any) => {
		const codeElement = props.children;
		const className = codeElement?.props?.className || "";

		const match = className.match(/language-(\w+)/);
		const language = match?.[1] ?? "text";

		const rawCode = extractTextFromCode(codeElement?.props?.children);
		const { theme } = useTheme();

		return (
			<div className="not-typeset my-6 overflow-hidden rounded-lg border border-border">
				<CodeBlockHeader
					language={language}
					code={rawCode}
				/>

				<SyntaxHighlighter
					language={language}
					style={theme === "dark" ? oneDark : oneLight}
					PreTag="div"
					customStyle={{
						margin: 0,
						padding: "1rem",
						background: "transparent",
					}}
					codeTagProps={{
						className: "font-jet-mono text-base",
					}}
				>
					{rawCode.replace(/\n$/, "")}
				</SyntaxHighlighter>
			</div>
		);
	},
	a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
		const { setPageNumber } = usePdfViewer();
		const pageMatch = href?.match(/^#page-(\d+)$/);
		if (pageMatch) {
			return (
				<button
					onClick={() => setPageNumber(Number(pageMatch[1]))}
					className="inline-flex items-center rounded-md bg-neutral-200 dark:bg-neutral-900/40 px-1.5 py-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer"
				>
					Page {pageMatch[1]}
				</button>
			);
		}
		return <a href={href}>{children}</a>;
	},
};
