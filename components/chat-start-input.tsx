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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

const ChatStartInput = ({
	onFileUpload,
}: {
	onFileUpload?: (files: File[]) => void;
}) => {
	const [input, setInput] = useState("");
	const startChat = api.chat.createChat.useMutation();
	const addMessage = api.message.createMessage.useMutation();
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const baseInputRef = useRef("");

	const {
		isListening,
		isSupported,
		toggleListening,
		stopListening,
	} = useSpeechRecognition({
		continuous: true,
		interimResults: true,
		onTranscriptChange: (spokenText) => {
			const base = baseInputRef.current;
			const separator =
				base && !base.endsWith(" ") && !base.endsWith("\n") ? " " : "";
			setInput(base ? `${base}${separator}${spokenText}` : spokenText);
		},
	});

	const handleToggleVoice = () => {
		if (!isListening) {
			baseInputRef.current = input;
		}
		toggleListening();
	};

	const handleSend = async () => {
		if (isListening) {
			stopListening();
		}
		if (!input.trim() || startChat.isPending || addMessage.isPending) return;

		const chat = await startChat.mutateAsync({
			title: input.slice(0, 50),
		});

		if (!chat) {
			toast.error("Failed to create chat");
			return;
		}

		const message = await addMessage.mutateAsync({
			chatId: chat.id,
			content: input,
			role: "USER",
		});

		if (!message) {
			toast.error("Failed to add message");
			return;
		}

		router.push(`/chat/${chat.id}`);
		setInput("");
		baseInputRef.current = "";
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<InputGroup className="p-2">
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
				id="chat-start-textarea"
				placeholder={isListening ? "Listening to your voice..." : "Ask to start a chat..."}
				className={cn(
					"text-lg! max-h-80 overflow-y-auto scrollbar-thumb-lime-600 scrollbar-thin",
					isListening && "placeholder:text-red-500/80 placeholder:animate-pulse"
				)}
				value={input}
				onChange={(e) => {
					setInput(e.target.value);
					if (!isListening) {
						baseInputRef.current = e.target.value;
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
						disabled={startChat.isPending || addMessage.isPending}
						onClick={handleToggleVoice}
					>
						{isListening ? <MicOff size={18} /> : <Mic size={18} />}
					</InputGroupButton>

					<InputGroupButton
						variant="ghost"
						size="sm"
						className="rounded-full p-2 cursor-pointer"
						disabled={startChat.isPending || addMessage.isPending || !input.trim()}
						onClick={handleSend}
					>
						<ArrowUp size={18} />
					</InputGroupButton>
				</div>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatStartInput;
