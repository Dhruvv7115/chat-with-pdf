import { Role } from "@/lib/generated/prisma/enums";
import { Check, Copy } from "lucide-react";
import React, { ComponentPropsWithoutRef, useState } from "react";
import ReactMarkdown from "react-markdown";
type Message = {
	id: string;
	role: Role;
	content: string;
	createdAt: string;
	updatedAt: string;
	chatId: string;
};
const AiMessage = ({ message }: { message: Message }) => {
	const [copied, setCopied] = useState(false);

	const handleCopyAll = async () => {
		// Copies the exact, full raw markdown text to clipboard
		await navigator.clipboard.writeText(message.content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000); // Reset feedback after 2 seconds
	};

	return (
		<div className="flex items-center justify-start gap-4 w-full h-fit mb-4">
			<div className="rounded-lg lg:px-12 md:px-6 sm:px-4 px-2 py-2 max-w-full prose prose-lime prose-sm prose-li:marker:text-black/50 dark:prose-invert relative group">
				{/* Global Copy Button */}

				<ReactMarkdown>{message.content}</ReactMarkdown>
				<div className="flex items-center">
					<button
						onClick={handleCopyAll}
						title="Copy full text"
						className="flex group-hover:opacity-100 opacity-0 items-center justify-center  text-sm text-gray-500 hover:text-gray-600 transition-colors bg-transparent border-0 cursor-pointer rounded-md"
					>
						{copied ? (
							<Check
								size={12}
								style={{ color: "#10b981" }}
							/>
						) : (
							<Copy size={12} />
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AiMessage;
