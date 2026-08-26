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
	setAiResponse?: React.Dispatch<React.SetStateAction<string>>;
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

	const handleSend = async () => {
		if (!question.trim() || createMessage.isPending) return;
		const content = question;
		setQuestion("");
		try {
			await createMessage.mutateAsync({ chatId, content, role: "USER" });
		} catch {
			setQuestion(content); // restore on failure so the user doesn't lose their draft
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
				placeholder="Ask anything…"
				className="min-w-0 max-h-[min(40vh,12rem)] overflow-y-auto wrap-break-word text-base!"
				disabled={createMessage.isPending}
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
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
					variant="default"
					size="sm"
					className="ml-auto rounded-full p-2"
					disabled={createMessage.isPending || !question.trim()}
					onClick={handleSend}
				>
					<ArrowUp />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatInput;
