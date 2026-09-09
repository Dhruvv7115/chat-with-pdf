// chat-input.tsx
"use client";

import React, { useRef, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ChatStatus } from "ai";

const ChatInput = ({
	chatId,
	onSend,
	chatStatus,
}: {
	chatId: string;
	onSend?: (content: string) => Promise<void>;
	chatStatus?: ChatStatus;
}) => {
	const [question, setQuestion] = useState("");
	const baseQuestionRef = useRef("");

	const { isListening, isSupported, toggleListening, stopListening } =
		useSpeechRecognition({
			continuous: true,
			interimResults: true,
			onTranscriptChange: (spokenText) => {
				const base = baseQuestionRef.current;
				const separator =
					base && !base.endsWith(" ") && !base.endsWith("\n") ? " " : "";
				setQuestion(base ? `${base}${separator}${spokenText}` : spokenText);
			},
		});

	const handleToggleVoice = () => {
		if (!isListening) {
			baseQuestionRef.current = question;
		}
		toggleListening();
	};

	const handleSend = async () => {
		if (isListening) {
			stopListening();
		}

		const trimmed = question.trim();
		if (!trimmed) return;
		if (chatStatus === "streaming" || chatStatus === "submitted") return;

		setQuestion("");
		baseQuestionRef.current = "";

		try {
			if (onSend) {
				await onSend(trimmed);
			}
		} catch (error: any) {
			setQuestion(trimmed); // restore on failure so the user doesn't lose their draft
			baseQuestionRef.current = trimmed;
			toast.error(error?.message || "Failed to send message");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (chatStatus !== "ready") return;
			handleSend();
		}
	};

	const canSend = chatStatus === "ready" && !!question.trim();

	return (
		<InputGroup className="p-2 rounded-2xl active:ring-1! ring-lime-500/60! dark:ring-primary/40!">
			<InputGroupTextarea
				id="chat-input-textarea"
				placeholder={
					isListening ? "Listening to your voice..." : "Ask anything…"
				}
				className={cn(
					"min-w-0 max-h-[min(40vh,12rem)] overflow-y-auto wrap-break-word text-base!",
					isListening &&
						"placeholder:text-lime-500/80 placeholder:animate-pulse",
				)}
				disabled={chatStatus !== "ready"}
				value={question}
				onChange={(e) => {
					setQuestion(e.target.value);
					if (!isListening) {
						baseQuestionRef.current = e.target.value;
					}
				}}
				onKeyDown={handleKeyDown}
			/>

			<InputGroupAddon align="block-end">
				<div className="ml-auto flex items-center gap-1.5">
					<InputGroupButton
						variant={isListening ? "destructive" : "ghost"}
						size="sm"
						className={cn(
							"rounded-full p-2 transition-all cursor-pointer",
							isListening
								? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-md shadow-red-500/30"
								: "text-muted-foreground hover:text-foreground",
						)}
						title={
							!isSupported
								? "Speech recognition is not supported in this browser"
								: isListening
									? "Stop listening"
									: "Use voice input"
						}
						disabled={chatStatus !== "ready"}
						onClick={handleToggleVoice}
					>
						{isListening ? <MicOff size={18} /> : <Mic size={18} />}
					</InputGroupButton>

					<InputGroupButton
						variant="default"
						size="sm"
						className="rounded-full p-2 cursor-pointer"
						disabled={!canSend}
						onClick={handleSend}
					>
						<ArrowUp size={18} />
					</InputGroupButton>
				</div>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatInput;
