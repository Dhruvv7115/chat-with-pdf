import CodeBlockHeader from "@/components/markdown/code-block-header";
import { usePdfViewer } from "@/hooks/pdf-viewer-context";
import { extractTextFromCode } from "@/utils/markdown";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { flexokiDark, flexokiLight } from "@/utils/flexoki-theme";
export const customComponents = {
	pre: (props: any) => {
		const codeElement = props.children;
		const className = codeElement?.props?.className || "";

		const match = className.match(/language-(\w+)/);
		const language = match?.[1] ?? "text";

		const rawCode = extractTextFromCode(codeElement?.props?.children);
		const { resolvedTheme } = useTheme();

		return (
			<div className="not-typeset my-6 overflow-hidden rounded-lg border border-border w-full min-w-0 max-w-full">
				<CodeBlockHeader
					language={language}
					code={rawCode}
				/>

				<div className="p-1 max-w-full min-w-0 overflow-x-auto">
					<SyntaxHighlighter
						language={language}
						style={resolvedTheme === "dark" ? flexokiDark : flexokiLight}
						PreTag="div"
						customStyle={{
							margin: 0,
							padding: "1rem",
							background:
								resolvedTheme === "dark" ? "rgb(0,0,0)" : "rgb(255,255,255)",
							border:
								resolvedTheme === "dark"
									? "1px solid lab(15.7305 0.613764 -2.16959)"
									: "1px solid lab(90.6853 0.399232 -1.45452)",

							borderRadius: "9px",
							width: "max-content",
							minWidth: "100%",
						}}
						codeTagProps={{
							className: "font-code text-base block w-fit min-w-full",
						}}
					>
						{rawCode.replace(/\n$/, "")}
					</SyntaxHighlighter>
				</div>
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
