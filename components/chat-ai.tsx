import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import AiMessage from "./ai-message";
import UserMessage from "./user-message";
import ChatInput from "./chat-input";
import { api } from "@/trpc/client";
import { FileType } from "@/lib/generated/prisma/enums";
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { usePreferences } from "@/hooks/use-preferences";
import { Bubble, BubbleContent } from "./ui/bubble";
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

interface Message {
	id: string;
	role: "USER" | "ASSISTANT";
	content: string;
	createdAt: string;
	updatedAt: string;
	chatId: string;
}

const ChatAi = ({
	chat,
	docUrl,
	doc,
}: {
	chat: Chat;
	docUrl?: string;
	doc?: Doc | null;
}) => {
	const { preferences } = usePreferences();
	const utils = api.useUtils();

	const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
		api.chat.getMessages.useInfiniteQuery(
			{ chatId: chat.id, limit: 10 },
			{ getNextPageParam: (lastPage) => lastPage.nextCursor },
		);

	const createMessage = api.message.createMessage.useMutation({
		onSuccess: () => {
			utils.chat.getMessages.invalidate({ chatId: chat.id });
		},
	});

	// Stable reference — only changes when `data` actually changes.
	const messages: Message[] = useMemo(
		() =>
			data?.pages
				.slice()
				.reverse()
				.flatMap((page) => page.messages) ?? [],
		[data],
	);

	// Local-only streaming state — never merged into the query cache.
	const [streamingMessage, setStreamingMessage] = useState<{
		id: string;
		content: string;
	} | null>(null);
	const [isStreaming, setIsStreaming] = useState(false);
	const [error, setError] = useState<string>("");

	// Guards against the effect firing more than once for the same trigger,
	// regardless of how many times `messages`/`preferences` re-render.
	const respondedToMessageId = useRef<string | null>(null);
	const hasFetchedSummary = useRef(false);

	const justFinishedStreaming = useRef(false);
	useEffect(() => {
		if (isLoading) return;

		const lastMessage = messages[messages.length - 1];

		// Case 1: chat has a doc and no messages yet — generate a summary.
		if (doc && docUrl && messages.length === 0 && !hasFetchedSummary.current) {
			hasFetchedSummary.current = true;
			setIsStreaming(true);
			setError("");
			setStreamingMessage({ id: "streaming-response", content: "" });

			fetch("/api/ai/summary", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ documentId: doc.id, docUrl }),
			})
				.then(async (res) => {
					if (!res.ok) {
						const body = await res.json().catch(() => ({}));
						throw new Error(body.error || "Failed to process document");
					}
					const reader = res.body?.getReader();
					if (!reader) return;
					const decoder = new TextDecoder("utf-8");
					let content = "";

					while (true) {
						const { value, done } = await reader.read();
						if (done) break;
						const chunk = decoder.decode(value);
						content += chunk;
						setStreamingMessage((prev) => ({
							id: "streaming-response",
							content: (prev?.content ?? "") + chunk,
						}));
					}

					await createMessage.mutateAsync({
						chatId: chat.id,
						content,
						role: "ASSISTANT",
					});
					setIsStreaming(false);
					justFinishedStreaming.current = true;
				})
				.catch((err) => {
					console.error(err);
					hasFetchedSummary.current = false; // allow retry
					setError(
						err.message || "Something went wrong processing this document.",
					);
					setIsStreaming(false);
					setStreamingMessage(null);
				});
			return;
		}

		// Case 2: no doc, no messages — nothing to do yet.
		if (!doc && messages.length === 0) return;

		// Case 3: respond to a new user message, once.
		if (
			messages.length !== 0 &&
			lastMessage.role === "USER" &&
			respondedToMessageId.current !== lastMessage.id
		) {
			respondedToMessageId.current = lastMessage.id;
			setIsStreaming(true);
			setError("");
			setStreamingMessage({ id: "streaming-response", content: "" });

			fetch("/api/ai/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ preferences, chatId: chat.id }),
			})
				.then(async (res) => {
					if (!res.ok) {
						const body = await res.json().catch(() => ({}));
						throw new Error(body.error || "Failed to generate a response.");
					}
					const reader = res.body?.getReader();
					if (!reader) return;
					const decoder = new TextDecoder("utf-8");
					let content = "";

					while (true) {
						const { value, done } = await reader.read();
						if (done) break;
						const chunk = decoder.decode(value);
						content += chunk;
						setStreamingMessage((prev) => ({
							id: "streaming-response",
							content: (prev?.content ?? "") + chunk,
						}));
					}

					await createMessage.mutateAsync({
						chatId: chat.id,
						content,
						role: "ASSISTANT",
					});
					setIsStreaming(false);
					justFinishedStreaming.current = true;
				})
				.catch((err) => {
					console.error(err);
					respondedToMessageId.current = null; // allow retry
					setError(err.message || "Failed to generate a response.");
					setIsStreaming(false);
					setStreamingMessage(null);
				});
		}
	}, [messages, isLoading, preferences, doc, docUrl]);

	useEffect(() => {
		if (!justFinishedStreaming.current) return;
		const lastMessage = messages[messages.length - 1];
		if (lastMessage?.role === "ASSISTANT") {
			setStreamingMessage(null);
			justFinishedStreaming.current = false;
		}
	}, [messages]);

	// Merge streaming message in for render only — never touches query cache.
	const displayMessages = streamingMessage
		? [
				...messages,
				{
					id: streamingMessage.id,
					role: "ASSISTANT" as const,
					content: streamingMessage.content,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					chatId: chat.id,
				},
			]
		: messages;

	return (
		<div className="flex h-full w-full flex-col items-center justify-between">
			<MessageScrollerProvider
				autoScroll={preferences.autoScroll}
				defaultScrollPosition="end"
			>
				<MessageScroller className="w-full flex-1">
					<MessageScrollerViewport>
						<MessageScrollerContent className="mx-auto max-w-4xl">
							{hasNextPage && (
								<MessageScrollerItem>
									<div className="flex justify-center py-3">
										<button
											onClick={() => fetchNextPage()}
											disabled={isFetchingNextPage}
											className="text-xs text-muted-foreground hover:text-foreground transition-colors"
										>
											{isFetchingNextPage
												? "Loading older messages..."
												: "Load older messages"}
										</button>
									</div>
								</MessageScrollerItem>
							)}

							{!isLoading &&
								displayMessages.map((message) => (
									<MessageScrollerItem
										key={message.id}
										messageId={message.id}
									>
										{message.role === "USER" ? (
											<UserMessage message={message} />
										) : (
											<AiMessage message={message} />
										)}
									</MessageScrollerItem>
								))}

							{isStreaming && !streamingMessage?.content && (
								<MessageScrollerItem messageId="thinking">
									<ThinkingIndicator />
								</MessageScrollerItem>
							)}

							{error && (
								<MessageScrollerItem messageId="error">
									<div className="flex flex-col items-center justify-center gap-3 py-8">
										<p className="text-sm text-red-500">{error}</p>
										<button
											onClick={() => {
												setError("");
												hasFetchedSummary.current = false;
												respondedToMessageId.current = null;
												utils.chat.getMessages.invalidate({ chatId: chat.id });
											}}
											className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
										>
											Try again
										</button>
									</div>
								</MessageScrollerItem>
							)}
						</MessageScrollerContent>
					</MessageScrollerViewport>
					<MessageScrollerButton variant="default" />
				</MessageScroller>
			</MessageScrollerProvider>

			<div className="w-full max-w-4xl p-4">
				<ChatInput chatId={chat.id} />
			</div>
		</div>
	);
};

export default ChatAi;
