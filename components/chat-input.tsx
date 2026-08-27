// chat-input.tsx
"use client";

import React, { useRef, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, Mic, MicOff, Plus } from "lucide-react";
import { api } from "@/trpc/client";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

const ChatInput = ({
	chatId,
	onFileUpload,
}: {
	chatId: string;
	setAiResponse?: React.Dispatch<React.SetStateAction<string>>;
	onFileUpload?: (files: File[]) => void;
}) => {
	const utils = api.useUtils();
	const [question, setQuestion] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const baseQuestionRef = useRef("");

	const createMessage = api.message.createMessage.useMutation({
		onSuccess: () => {
			utils.chat.getMessages.invalidate({ chatId });
		},
	});

	const {
		isListening,
		isSupported,
		toggleListening,
		stopListening,
	} = useSpeechRecognition({
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
		if (!question.trim() || createMessage.isPending) return;
		const content = question;
		setQuestion("");
		baseQuestionRef.current = "";
		try {
			await createMessage.mutateAsync({ chatId, content, role: "USER" });
		} catch {
			setQuestion(content); // restore on failure so the user doesn't lose their draft
			baseQuestionRef.current = content;
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (!createMessage.isPending) handleSend();
		}
	};

	return (
		<InputGroup className="p-2 rounded-4xl active:ring-1! ring-lime-500/60! dark:ring-primary/40!">
			{onFileUpload && (
				<input
					ref={fileInputRef}
					type="file"
					accept=".pdf,.docx,.doc,.md,.markdown,.txt,.csv"
					className="hidden"
					onChange={(e) => {
						const files = Array.from(e.target.files ?? []);
						if (files.length) onFileUpload(files);
						e.target.value = "";
					}}
				/>
			)}

			<InputGroupTextarea
				id="chat-input-textarea"
				placeholder={isListening ? "Listening to your voice..." : "Ask anything…"}
				className={cn(
					"min-w-0 max-h-[min(40vh,12rem)] overflow-y-auto wrap-break-word text-base!",
					isListening && "placeholder:text-lime-500/80 placeholder:animate-pulse"
				)}
				disabled={createMessage.isPending}
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
				{onFileUpload && (
					<InputGroupButton
						variant="ghost"
						size="sm"
						className="rounded-full p-2"
						title="Upload a file"
						onClick={() => fileInputRef.current?.click()}
					>
						<Plus size={18} />
					</InputGroupButton>
				)}

				<div className="ml-auto flex items-center gap-1.5">
					<InputGroupButton
						variant={isListening ? "destructive" : "ghost"}
						size="sm"
						className={cn(
							"rounded-full p-2 transition-all cursor-pointer",
							isListening
								? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-md shadow-red-500/30"
								: "text-muted-foreground hover:text-foreground"
						)}
						title={
							!isSupported
								? "Speech recognition is not supported in this browser"
								: isListening
								? "Stop listening"
								: "Use voice input"
						}
						disabled={createMessage.isPending}
						onClick={handleToggleVoice}
					>
						{isListening ? <MicOff size={18} /> : <Mic size={18} />}
					</InputGroupButton>

					<InputGroupButton
						variant="default"
						size="sm"
						className="rounded-full p-2 cursor-pointer"
						disabled={createMessage.isPending || !question.trim()}
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
