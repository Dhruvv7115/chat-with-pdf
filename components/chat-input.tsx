// chat-input.tsx
import React, { useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowUp } from "lucide-react";
import { api } from "@/trpc/client";

const ChatInput = ({
	chatId,
	setAiResponse,
}: {
	chatId: string;
	setAiResponse: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const utils = api.useUtils();
	const [question, setQuestion] = useState("");

	const createMessage = api.message.createMessage.useMutation({
		onMutate: async (newMessage) => {
			await utils.chat.getMessages.cancel({ chatId });
			const previousMessages = utils.chat.getMessages.getData({ chatId });

			utils.chat.getMessages.setData({ chatId }, (old) => [
				...(old ?? []),
				{
					id: `temp-${Date.now()}`,
					chatId,
					role: newMessage.role,
					content: newMessage.content,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			]);

			return { previousMessages };
		},
		onError: (err, newMessage, context) => {
			utils.chat.getMessages.setData({ chatId }, context?.previousMessages);
		},
		onSettled: () => {
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
		setQuestion(""); // clear input immediately too
	};

	return (
		<InputGroup className="p-2">
			<InputGroupTextarea
				id="block-end-textarea"
				placeholder="Ask to start a chat..."
				disabled={createMessage.isPending}
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
			/>
			<InputGroupAddon align="block-end">
				<Select>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="Model" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="light">Light</SelectItem>
							<SelectItem value="dark">Dark</SelectItem>
							<SelectItem value="system">System</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
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
