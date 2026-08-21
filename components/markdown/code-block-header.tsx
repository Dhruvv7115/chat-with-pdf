// components/code-block-header.tsx
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

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

	return (
		<div className="flex items-center justify-between px-4 pt-3 text-sm font-jet-mono font-semibold dark:text-primary text-lime-600">
			<span>{language ? `</>  ${language}` : "txt"}</span>
			<button
				onClick={handleCopy}
				className={cn("flex items-center gap-1 transition-colors font-medium hover:bg-black/40 p-2 rounded-lg", copied ? "text-primary" : "text-muted-foreground hover:text-foreground", "cursor-pointer")}
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
