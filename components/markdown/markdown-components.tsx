import CodeBlockHeader from "@/components/markdown/code-block-header";
import { extractTextFromCode } from "@/utils/markdown";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
};
