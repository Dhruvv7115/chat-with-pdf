import CodeBlockHeader from "@/components/markdown/code-block-header";
import { extractTextFromCode } from "@/utils/markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Modern dark style option from Prism module line
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const customComponents = {
	h1: (props: any) => (
		<h1
			className="text-2xl font-bold mt-6 mb-3 text-foreground tracking-tight"
			{...props}
		/>
	),
	h2: (props: any) => (
		<h2
			className="text-xl font-semibold mt-5 mb-2.5 text-foreground tracking-tight"
			{...props}
		/>
	),
	h3: (props: any) => (
		<h3
			className="text-lg font-semibold mt-4 mb-2 text-foreground"
			{...props}
		/>
	),

	p: (props: any) => (
		<p
			className="mb-4 text-foreground/90 leading-relaxed"
			{...props}
		/>
	),

	ul: (props: any) => (
		<ul
			className="list-disc pl-6 mb-4 space-y-1 marker:text-primary"
			{...props}
		/>
	),
	ol: (props: any) => (
		<ol
			className="list-decimal pl-6 mb-4 space-y-1 marker:text-primary marker:font-medium"
			{...props}
		/>
	),
	li: (props: any) => (
		<li
			className="text-foreground/90 leading-relaxed"
			{...props}
		/>
	),

	a: (props: any) => (
		<a
			target="_blank"
			// rel="noopener noreferrer"
			className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary transition-colors"
			{...props}
		/>
	),

	strong: (props: any) => (
		<strong
			className="font-semibold text-foreground"
			{...props}
		/>
	),

	pre: (props: any) => {
		const codeElement = props.children;
		const className = codeElement?.props?.className || "";
		const match = className.match(/language-(\w+)/);
		const language = match ? match[1] : null;
		const rawCode = extractTextFromCode(codeElement?.props?.children);

		return (
			<div className="not-prose mb-4 rounded-lg overflow-hidden border border-border font-jet-mono">
				<CodeBlockHeader
					language={language}
					code={rawCode}
				/>
				<pre className="bg-neutral-200/40 dark:bg-neutral-900 overflow-x-auto text-sm font-jet-mono leading-relaxed p-4">
					{props.children}
				</pre>
			</div>
		);
	},

	code: (props: any) => {
		const isInline = !props.className?.includes("language-");
		const className = props.className || "";
		const match = className.match(/language-(\w+)/);
		const language = match ? match[1] : null;
		return isInline ? (
			<code
				className="bg-muted text-primary px-1.5 py-0.5 rounded font-jet-mono border border-border"
				{...props}
			/>
		) : (
			<SyntaxHighlighter
				useInlineStyles={false} // 👈 CRITICAL: Strips static inline styles
				language={match[1]}
				PreTag="div"
				className="p-4 leading-relaxed overflow-x-auto text-neutral-800 dark:text-neutral-200"
				{...props}
				codeTagProps={{
					className: "font-jet-mono",
				}}
			>
				{String(props.children).replace(/\n$/, "")}
			</SyntaxHighlighter>
		);
	},

	blockquote: (props: any) => (
		<blockquote
			className="border-l-2 border-primary pl-4 my-4 text-muted-foreground italic"
			{...props}
		/>
	),

	hr: (props: any) => (
		<hr
			className="my-6 border-border"
			{...props}
		/>
	),

	table: (props: any) => (
		<div className="overflow-x-auto mb-2">
			<table
				className="w-full text-sm border-collapse"
				{...props}
			/>
		</div>
	),
	th: (props: any) => (
		<th
			className="border border-neutral-300 dark:border-neutral-700 bg-muted px-4 py-3 text-left font-medium text-foreground"
			{...props}
		/>
	),
	td: (props: any) => (
		<td
			className="border border-neutral-300 dark:border-neutral-700 px-4 py-3 text-foreground/90"
			{...props}
		/>
	),
};
