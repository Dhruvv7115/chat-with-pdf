import React, { useEffect, useRef, useState } from "react";
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
type Pdf = {
	userId: string;
	title: string;
	id: string;
	createdAt: Date;
	updatedAt: Date;
	fileKey: string;
	fileSize: number | null;
	pageCount: number | null;
};

const ChatAi = ({
	chat,
	pdfUrl,
	pdf,
}: {
	chat: Chat;
	pdfUrl?: string;
	pdf: Pdf;
}) => {
	const { data: messages, refetch } = api.chat.getMessages.useQuery({
		chatId: chat.id,
	});
	const createMessage = api.message.createMessage.useMutation();
	const aiSummaryRef = useRef("");
	api.message.createAiSummary.useSubscription(
		{
			pdfId: pdf?.id ?? "",
			pdfUrl: pdfUrl ?? "",
		},
		{
			enabled: (pdfUrl && messages?.length === 0) || false,
			onData: (data) => {
				aiSummaryRef.current += data.value;
				console.log(data.value);
			},
			onComplete: () => {
				createMessage.mutate({
					chatId: chat.id,
					content: aiSummaryRef.current,
					role: "ASSISTANT",
				});
				refetch();
			},
		},
	);
	const [aiResponse, setAiResponse] = useState<string>("");

	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, aiResponse]);

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
				{!!aiResponse && (
					<AiMessage
						message={{
							id: "ai-response",
							role: "ASSISTANT",
							content: aiResponse,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
							chatId: chat.id,
						}}
					/>
				)}
				<div ref={bottomRef} />
			</div>
			<div className="px-6 py-2">
				<ChatInput
					chatId={chat.id}
					setAiResponse={setAiResponse}
				/>
			</div>
		</div>
	);
};

export default ChatAi;
