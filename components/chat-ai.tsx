import React, { useEffect, useRef, useState } from "react";
import AiMessage from "./ai-message";
import UserMessage from "./user-message";
import ChatInput from "./chat-input";
import { api } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { FileType } from "@/lib/generated/prisma/enums";
import ThinkingIndicator from "./thinking-indicator";

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
	fileType: FileType;
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
	doc?: Doc | null;
}) => {
	const { data: messages, refetch } = api.chat.getMessages.useQuery({
		chatId: chat.id,
	});
	const utils = api.useUtils();
	const createMessage = api.message.createMessage.useMutation({
		onMutate: async (newMessage) => {
			await utils.chat.getMessages.cancel({ chatId: chat.id });
			const previousMessages = utils.chat.getMessages.getData({
				chatId: chat.id,
			});

			utils.chat.getMessages.setData({ chatId: chat.id }, (old) => [
				...(old ?? []),
				{
					id: `temp-${Date.now()}`,
					chatId: chat.id,
					role: newMessage.role,
					content: newMessage.content,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			]);

			return { previousMessages };
		},
		onError: (err, newMessage, context) => {
			// roll back on failure
			utils.chat.getMessages.setData(
				{ chatId: chat.id },
				context?.previousMessages,
			);
		},
		onSettled: () => {
			utils.chat.getMessages.invalidate({ chatId: chat.id });
		},
	});
	const aiSummaryRef = useRef("");
	const hasFetched = useRef(false);
	const [error, setError] = useState<string | null>(null);
	const respondedToMessageId = useRef<string | null>(null);

	useEffect(() => {
		if (!messages) return; // still loading, don't do anything yet

		const lastMessage = messages[messages.length - 1];

		// Case 1: Doc-based chat, first ever message — generate the auto-summary
		if (doc && docUrl && messages.length === 0 && !hasFetched.current) {
			hasFetched.current = true;
			setError(null);
			fetch("/api/ai/summary", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ documentId: doc.id, docUrl }),
			})
				.then(async (res) => {
					if (!res.ok) {
						const data = await res.json().catch(() => ({}));
						throw new Error(data.error || "Failed to process document");
					}
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
				})
				.catch((err) => {
					console.error(err);
					setError(
						err.message || "Something went wrong processing this document.",
					);
					hasFetched.current = false; // allow retry
				});
			return;
		}

		// Case 2: doc-less chat with no messages yet — nothing to respond to, wait for user input
		if (messages.length === 0) {
			return;
		}

		// Case 3: there's at least one message, and the last one is from the user —
		// this applies to BOTH doc and doc-less chats identically, since /api/ai/chat
		// should already branch internally on whether chat.documentId exists (RAG vs plain)
		if (
			lastMessage?.role === "USER" &&
			lastMessage.id !== respondedToMessageId.current &&
			!lastMessage.id.startsWith("temp-") // skip optimistic placeholder, wait for real id
		) {
			respondedToMessageId.current = lastMessage.id;
			fetch("/api/ai/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chatId: chat.id,
					messageId: lastMessage.id,
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
	const showThinking =
		!error &&
		!aiResponse &&
		(messages?.length === 0 ||
			messages?.[messages.length - 1]?.role === "USER");

	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, aiResponse]);

	return (
		<div className="flex flex-col w-full h-full overflow-y-hidden justify-between py-4">
			<div className="overflow-y-auto h-full w-full mx-auto max-w-4xl scrollbar-none">
				{error && (
					<div className="flex flex-col items-center justify-center h-full w-full gap-3">
						<p className="text-red-500 text-sm">{error}</p>
						<button
							onClick={() => {
								setError(null);
								hasFetched.current = false;
								refetch();
							}}
							className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
						>
							Try again
						</button>
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
				{showThinking && <ThinkingIndicator />}
				<div ref={bottomRef} />
			</div>
			<div className="px-6 py-2 max-w-4xl mx-auto w-full">
				<ChatInput
					chatId={chat.id}
					setAiResponse={setAiResponse}
				/>
			</div>
		</div>
	);
};

export default ChatAi;
