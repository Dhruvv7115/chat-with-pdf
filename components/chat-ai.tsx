import React, { useEffect, useRef, useState } from "react";
import AiMessage from "./ai-message";
import UserMessage from "./user-message";
import ChatInput from "./chat-input";
import { api } from "@/trpc/client";
import { Loader2 } from "lucide-react";

export type Chat = {
	id: string;
	title: string;
	userId: string;
	documentId: string | null;
	createdAt: Date;
	updatedAt: Date;
};
export type Doc = {
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
	docUrl,
	doc,
}: {
	chat: Chat;
	docUrl?: string;
	doc?: Doc;
}) => {
	const { data: messages, refetch } = api.chat.getMessages.useQuery({
		chatId: chat.id,
	});
	const createMessage = api.message.createMessage.useMutation();
	const aiSummaryRef = useRef("");
	const hasFetched = useRef(false);

	useEffect(() => {
		if (docUrl && messages?.length === 0 && doc) {
			hasFetched.current = true;
			fetch("/api/ai/summary", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					documentId: doc.id,
					docUrl,
				}),
			}).then(async (res) => {
				const reader = res.body?.getReader();
				const decoder = new TextDecoder();

				while (true) {
					const { done, value } = await reader!.read();
					if (done) break;
					const text = decoder.decode(value);
					setAiResponse((p) => p + text);
					aiSummaryRef.current += text;
				}
				await createMessage.mutateAsync({
					chatId: chat.id,
					content: aiSummaryRef.current,
					role: "ASSISTANT",
				});
				aiSummaryRef.current = "";
				setAiResponse("");
				refetch();
			});
		}
	}, [messages]);
	const [aiResponse, setAiResponse] = useState<string>("");

	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, aiResponse]);

	return (
		<div className="flex flex-col w-full h-full overflow-y-hidden justify-between py-4 bg-muted">
			<div className="overflow-y-auto h-full w-full">
				{messages?.length === 0 && (
					// <div className="flex gap-1">
					// 	<div className="animate-bounce delay-200 duration-100">•</div>
					// 	<div className="animate-bounce delay-100 duration-100">•</div>
					// 	<div className="animate-bounce delay-0 duration-100">•</div>
					// </div>
					<div className="flex items-center justify-center h-full w-full">
						<Loader2 className="animate-spin w-20 h-20 text-neutral-400" />
					</div>
				)}
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
