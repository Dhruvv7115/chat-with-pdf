import React, { useState } from "react";
import AiMessage from "./ai-message";
import UserMessage from "./user-message";
import ChatInput from "./chat-input";
import { api } from "@/trpc/client";

type Chat = {
	id: string;
	title: string;
	userId: string;
	pdfId: string;
	createdAt: Date;
	updatedAt: Date;
};

const ChatAi = ({ chat, pdfUrl }: { chat: Chat; pdfUrl?: string }) => {
	const { data: messages, refetch } = api.chat.getMessages.useQuery({
		chatId: chat.id,
	});
	console.log(messages);
	const [aiSummary, setAiSummary] = useState<string>("");
	const createMessage = api.message.createMessage.useMutation();
	api.message.createAiSummary.useSubscription(
		{
			chatId: chat.id,
			pdfUrl: pdfUrl ?? "",
		},
		{
			enabled: (pdfUrl && messages?.length === 0) || false,
			onData: (data) => {
				setAiSummary((prev) => prev + data.value);
				console.log(data.value);
			},
			onComplete: () => {
				createMessage.mutate({
					chatId: chat.id,
					content: aiSummary,
					role: "ASSISTANT",
				});
				refetch();
			},
		},
	);

	return (
		<div className="flex flex-col w-full h-full overflow-y-hidden justify-between py-4">
			<div className="px-4 py-6 overflow-y-auto h-full">
				{messages?.map((message) => {
					return message.role === "USER" ? (
						<UserMessage
							key={message.id}
							message={message}
						/>
					) : (
						<AiMessage
							key={message.id}
							message={message}
						/>
					);
				})}
			</div>
			<div className="px-4 py-2">
				<ChatInput chatId={chat.id} />
			</div>
		</div>
	);
};

export default ChatAi;
