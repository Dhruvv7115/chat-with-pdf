// chat-input.tsx
import React, { useRef, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, Plus } from "lucide-react";
import { api } from "@/trpc/client";

const ChatInput = ({
	chatId,
	setAiResponse,
	onFileUpload,
}: {
	chatId: string;
	setAiResponse: React.Dispatch<React.SetStateAction<string>>;
	onFileUpload?: (files: File[]) => void;
}) => {
	const utils = api.useUtils();
	const [question, setQuestion] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const createMessage = api.message.createMessage.useMutation({
		onSuccess: () => {
			utils.chat.getMessages.invalidate({ chatId });
		},
	});

	const handleSend = () => {
		if (!question.trim()) return;
		createMessage.mutate({
			chatId,
			content: question,
			role: "USER",
		});
		setQuestion("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<InputGroup className="p-2">
			{/* Hidden file input — only rendered when onFileUpload is provided */}
			{onFileUpload && (
				<input
					ref={fileInputRef}
					type="file"
					accept=".pdf,.docx,.doc,.md,.markdown,.txt,.csv"
					className="hidden"
					onChange={(e) => {
						const files = Array.from(e.target.files ?? []);
						if (files.length) onFileUpload(files);
						e.target.value = ""; // reset so same file can be re-selected
					}}
				/>
			)}

			<InputGroupTextarea
				id="chat-input-textarea"
				placeholder="Ask anything…"
				disabled={createMessage.isPending}
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
				onKeyDown={handleKeyDown}
			/>

			<InputGroupAddon align="block-end">
				{/* Plus / upload button — only shown when a handler is provided */}
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
					disabled={createMessage.isPending}
					onClick={handleSend}
				>
					<ArrowUp />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatInput;
