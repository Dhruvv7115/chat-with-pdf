"use client";
import React, { useRef, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, Plus } from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

	const handleSend = async () => {
		if (!input.trim()) return;

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
				placeholder="Ask to start a chat..."
				className="text-lg! max-h-80 overflow-y-auto scrollbar-thumb-lime-600 scrollbar-thin"
				value={input}
				onChange={(e) => setInput(e.target.value)}
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

				<InputGroupButton
					variant="ghost"
					size="sm"
					className="ml-auto rounded-full p-2"
					disabled={startChat.isPending || addMessage.isPending}
					onClick={handleSend}
				>
					<ArrowUp />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatStartInput;
