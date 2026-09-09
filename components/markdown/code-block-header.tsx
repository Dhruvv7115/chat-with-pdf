"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	C,
	CPlusplus,
	Css,
	Go,
	Html5,
	Java,
	Javascript,
	Markdown,
	Python,
	React,
	Rust,
	Solidity,
	Typescript,
} from "@thesvg/react";

const languageMap: Record<string, any> = {
	javascript: Javascript,
	json: Javascript,
	typescript: Typescript,
	tsx: React,
	jsx: React,
	python: Python,
	bash: Terminal,
	css: Css,
	html: Html5,
	txt: Terminal,
	text: Terminal,
	go: Go,
	md: Markdown,
	mdx: Markdown,
	c: C,
	cpp: CPlusplus,
	java: Java,
	rust: Rust,
	solidity: Solidity,
	sql: Terminal,
	sh: Terminal,
	shell: Terminal,
};

const CodeBlockHeader = ({
	language,
	code,
}: {
	language: string | null;
	code: string;
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	const normalizedLang = language?.toLowerCase();
	const Icon =
		normalizedLang && normalizedLang in languageMap
			? languageMap[normalizedLang]
			: null;

	return (
		<div className="flex items-center justify-between px-2 pt-1.5 text-sm font-jet-mono font-semibold dark:text-primary text-lime-600">
			<span className="ml-2">
				{Icon ? (
					<Icon
						variant="mono"
						className={cn("size-5 fill-neutral-600 dark:fill-neutral-400", {
							"size-8": language === "go",
							"size-4": language === "c",
						})}
					/>
				) : (
					<Terminal
						fill="var(--foreground)"
						className="size-5 rounded-xs"
					/>
				)}
			</span>
			<button
				onClick={handleCopy}
				className={cn(
					"flex items-center gap-1 transition-colors font-medium hover:bg-background/60 p-2 rounded-lg",
					copied
						? "text-primary"
						: "text-muted-foreground hover:text-foreground",
					"cursor-pointer",
				)}
			>
				{copied ? (
					<>
						<Check className="w-4 h-4" />
					</>
				) : (
					<>
						<Copy className="w-4 h-4" />
					</>
				)}
			</button>
		</div>
	);
};

export default CodeBlockHeader;
