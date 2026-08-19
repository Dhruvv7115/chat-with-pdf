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
		<div className="flex items-center justify-between bg-neutral-200 px-4 py-1.5 text-sm font-jet-mono font-semibold text-primary border-b border-border">
			<span>{language ?? "txt"}</span>
			<button
				onClick={handleCopy}
				className={cn("flex items-center gap-1 transition-colors font-medium", copied ? "text-primary" : "text-muted-foreground hover:text-foreground", "cursor-pointer")}
			>
				{copied ? (
					<>
						<Check className="w-3 h-3" />
						Copied
					</>
				) : (
					<>
						<Copy className="w-3 h-3" />
						Copy
					</>
				)}
			</button>
		</div>
	);
};

export default CodeBlockHeader;
