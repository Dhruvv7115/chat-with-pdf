"use client";

import React, { useRef, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentGroup,
	AttachmentMedia,
	AttachmentProgressRing,
	AttachmentTitle,
} from "@/components/ui/attachment";
import {
	ArrowUp,
	FileCode,
	FileCode2,
	FileText,
	Loader2,
	Mic,
	MicOff,
	Plus,
	X,
} from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useDocumentUpload } from "@/hooks/use-document-upload";
import { cn } from "@/lib/utils";

function getFileIcon(fileType?: string) {
	switch (fileType?.toUpperCase()) {
		case "PDF":
			return <FileText className="size-4 text-red-500" />;
		case "DOCX":
		case "DOC":
			return <FileCode2 className="size-4 text-blue-500" />;
		case "MARKDOWN":
		case "MD":
			return <FileCode className="size-4 text-emerald-500" />;
		default:
			return <FileText className="size-4 text-muted-foreground" />;
	}
}

const ChatStartInput = ({
	onFileUpload,
	showAttachment = true,
}: {
	onFileUpload?: (files: File[]) => void;
	showAttachment?: boolean;
}) => {
	const [input, setInput] = useState("");
	const utils = api.useUtils();
	const startChat = api.chat.createChat.useMutation({
		onSuccess: async () => {
			await utils.chat.getAllUserChats.invalidate();
		},
	});
	const addMessage = api.message.createMessage.useMutation();
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const baseInputRef = useRef("");

	const { attachment, startUpload, cancelUpload, isUploading } =
		useDocumentUpload();

	const { isListening, isSupported, toggleListening, stopListening } =
		useSpeechRecognition({
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

	const handleFileSelect = (files: File[]) => {
		if (!files.length) return;
		startUpload(files[0]);
		if (onFileUpload) {
			onFileUpload(files);
		}
	};

	const handleSend = async () => {
		if (isListening) {
			stopListening();
		}

		if (isUploading) {
			toast.info("Please wait for file upload to complete");
			return;
		}

		if (attachment?.state === "error") {
			toast.error("Please remove the failed attachment before continuing");
			return;
		}

		const hasAttachment = attachment?.state === "done" && !!attachment.docId;
		const hasText = !!input.trim();

		if (!hasText && !hasAttachment) return;
		if (startChat.isPending || addMessage.isPending) return;

		try {
			const title = hasAttachment
				? attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_")
				: input.slice(0, 50);

			const chat = await startChat.mutateAsync({
				title,
				docId: hasAttachment ? attachment.docId : undefined,
			});

			if (!chat) {
				toast.error("Failed to create chat");
				return;
			}

			if (hasText) {
				const message = await addMessage.mutateAsync({
					chatId: chat.id,
					content: input,
					role: "USER",
				});

				if (!message) {
					toast.error("Failed to add message");
					return;
				}
			}

			router.push(`/chat/${chat.id}`);
			setInput("");
			baseInputRef.current = "";
		} catch (error: any) {
			toast.error(error?.message || "Failed to start chat");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const canSend =
		!isUploading &&
		!startChat.isPending &&
		!addMessage.isPending &&
		(!!input.trim() || (attachment?.state === "done" && !!attachment.docId));

	return (
		<InputGroup className="p-2">
			{/* ── Attachment Preview in Block-Start Addon (Mobile) ── */}
			{showAttachment && attachment && (
				<InputGroupAddon
					align="block-start"
					className="w-full pb-1 md:hidden"
				>
					<AttachmentGroup className="w-full">
						<Attachment
							state={attachment.state}
							size="default"
							className="max-w-full bg-muted/40"
						>
							<AttachmentMedia>
								{attachment.state === "uploading" ? (
									<AttachmentProgressRing
										value={attachment.progress}
										size={22}
										strokeWidth={2.5}
									/>
								) : attachment.state === "processing" ? (
									<Loader2 className="size-4 animate-spin text-muted-foreground" />
								) : (
									getFileIcon(attachment.fileType)
								)}
							</AttachmentMedia>
							<AttachmentContent>
								<AttachmentTitle>{attachment.name}</AttachmentTitle>
								<AttachmentDescription>
									{attachment.state === "uploading"
										? `Uploading • ${attachment.progress}%`
										: attachment.state === "processing"
											? attachment.statusText || "Validating document..."
											: attachment.state === "error"
												? attachment.error || "Upload failed"
												: `${attachment.categoryLabel} • ${attachment.formattedSize}`}
								</AttachmentDescription>
							</AttachmentContent>
							<AttachmentActions>
								<AttachmentAction
									aria-label={`Remove ${attachment.name}`}
									onClick={cancelUpload}
									title="Remove attachment"
								>
									<X className="size-3.5" />
								</AttachmentAction>
							</AttachmentActions>
						</Attachment>
					</AttachmentGroup>
				</InputGroupAddon>
			)}

			{showAttachment && (
				<input
					ref={fileInputRef}
					type="file"
					accept=".pdf,.docx,.doc,.md,.markdown,.txt,.csv"
					className="hidden"
					onChange={(e) => {
						const files = Array.from(e.target.files ?? []);
						if (files.length) handleFileSelect(files);
						e.target.value = "";
					}}
				/>
			)}

			<InputGroupTextarea
				id="chat-start-textarea"
				placeholder={
					isListening
						? "Listening to your voice..."
						: attachment?.state === "done"
							? "Add an optional prompt or press enter to start..."
							: "Ask to start a chat..."
				}
				className={cn(
					"text-lg! max-h-80 overflow-y-auto scrollbar-thumb-lime-600 scrollbar-thin",
					isListening &&
						"placeholder:text-red-500/80 placeholder:animate-pulse",
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
				{showAttachment && (
					<InputGroupButton
						variant="ghost"
						size="sm"
						className="rounded-full p-2 cursor-pointer md:hidden"
						title="Upload a file"
						disabled={isUploading}
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
								: "text-muted-foreground hover:text-foreground",
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
						disabled={!canSend}
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
