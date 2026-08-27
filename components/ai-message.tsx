import { Role } from "@/lib/generated/prisma/enums";
import { Check, Copy, Loader2, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkEmoji from "remark-emoji";
import rehypeExternalLinks from "rehype-external-links";
import { customComponents } from "@/components/markdown/markdown-components";
import { escapeCurrencyDollars } from "@/lib/currency";

type Message = {
	id: string;
	role: Role;
	content: string;
	createdAt: string;
	updatedAt: string;
	chatId: string;
};

type TtsState = "idle" | "loading" | "playing";

const AiMessage = ({ message }: { message: Message }) => {
	const [copied, setCopied] = useState(false);
	const [ttsState, setTtsState] = useState<TtsState>("idle");

	const handleCopyAll = async () => {
		await navigator.clipboard.writeText(message.content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	function stripMarkdown(text: string): string {
		return text
			.replace(/^#{1,6}\s+/gm, "")
			.replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
			.replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
			.replace(/`([^`]+)`/g, "$1")
			.replace(/```[\s\S]*?```/g, "")
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			.replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
			.replace(/^>\s+/gm, "")
			.replace(/^[-*_]{3,}\s*$/gm, "")
			.replace(/^[\s]*[-*+]\s+/gm, "")
			.replace(/^[\s]*\d+\.\s+/gm, "")
			.replace(/\n{3,}/g, "\n\n")
			.trim();
	}

	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	const handleSpeak = () => {
		if (ttsState === "playing") {
			stopPlayback();
			return;
		}

		const cleanText = stripMarkdown(message.content);
		const utterance = new SpeechSynthesisUtterance(cleanText);

		const voices = window.speechSynthesis.getVoices();
		const chosenVoice = voices.find((v) => v.name === "Samantha");
		if (chosenVoice) utterance.voice = chosenVoice;

		utterance.rate = 1;
		utterance.pitch = 1;

		utterance.onend = () => setTtsState("idle");
		utterance.onerror = () => setTtsState("idle");

		utteranceRef.current = utterance;
		setTtsState("playing");
		window.speechSynthesis.speak(utterance);
	};

	const stopPlayback = () => {
		window.speechSynthesis.cancel();
		utteranceRef.current = null;
		setTtsState("idle");
	};
	function formatMessageDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();

		const diffMs = now.getTime() - date.getTime();

		const minutes = Math.floor(diffMs / (1000 * 60));
		const hours = Math.floor(diffMs / (1000 * 60 * 60));
		const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (minutes < 1) return "just now";
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	}

	return (
		<div className="flex items-center justify-center gap-4 w-full h-fit mb-4">
			<div className="md:px-4 px-2 py-2 max-w-full typeset typeset-chat relative group w-full">
				<ReactMarkdown
					remarkPlugins={[remarkGfm, remarkMath, remarkBreaks, remarkEmoji]}
					rehypePlugins={[rehypeKatex, rehypeExternalLinks]}
					components={customComponents}
				>
					{escapeCurrencyDollars(message.content)}
				</ReactMarkdown>

				<div className="flex items-center gap-2">
					{/* Copy button */}
					<button
						onClick={handleCopyAll}
						title="Copy full text"
						className="flex group-hover:opacity-100 opacity-0 items-center justify-center text-sm text-gray-500 hover:text-gray-600 transition-colors bg-transparent border-0 cursor-pointer rounded-md"
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

					{/* Text-to-speech button */}
					<button
						onClick={handleSpeak}
						title={
							ttsState === "playing"
								? "Stop reading"
								: ttsState === "loading"
									? "Generating audio…"
									: "Read aloud"
						}
						disabled={ttsState === "loading"}
						className="flex group-hover:opacity-100 opacity-0 items-center justify-center text-sm text-gray-500 hover:text-gray-600 transition-colors bg-transparent border-0 cursor-pointer rounded-md disabled:cursor-not-allowed"
					>
						{ttsState === "loading" ? (
							<Loader2
								size={12}
								className="animate-spin"
							/>
						) : ttsState === "playing" ? (
							<Square
								size={12}
								style={{ color: "#f59e0b" }}
							/>
						) : (
							<Volume2 size={12} />
						)}
					</button>
					<span className="flex group-hover:opacity-100 opacity-0 items-center justify-center text-xs text-gray-500 hover:text-gray-600 transition-colors bg-transparent border-0 cursor-pointer rounded-md disabled:cursor-not-allowed">
						{formatMessageDate(message.createdAt)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default AiMessage;
