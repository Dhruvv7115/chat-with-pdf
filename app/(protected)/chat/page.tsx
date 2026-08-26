"use client";
import FileUploadDemo from "@/components/file-upload-demo";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ChatStartInput from "@/components/chat-start-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { getFileType } from "@/utils/file-type";

const ChatPage = () => {
	const uploadDoc = api.pdf.getUploadUrl.useMutation();
	const utils = api.useUtils();
	const saveDoc = api.pdf.saveDoc.useMutation();
	const createChat = api.chat.createChat.useMutation({
		onSuccess: async () => {
			await utils.chat.getAllUserChats.invalidate();
		},
	});
	const router = useRouter();
	const sendMessage = api.message.createMessage.useMutation();

	// Fetch upload quota
	const { data: quota } = api.pdf.getUploadQuota.useQuery();

	const handlePdfUpload = async (files: File[]) => {
		if (!files.length) return;
		if (files.length > 1) {
			toast.error("Only one file at a time is allowed");
			return;
		}

		const file = files[0];

		try {
			// 1. Check file type if not the correct one(md, txt, pdf, docx, doc, markdown, csv) return
			const fileType = getFileType(file);
			if (!fileType) {
				toast.error(
					"File type not supported please try uploading one of the supported file types - [MD, PDF, DOCX, TXT]",
				);
				return;
			}
			// 2. Get pre-signed upload URL
			const { url, key } = await uploadDoc.mutateAsync({
				name: file.name,
				type: file.type,
				size: file.size,
			});

			// 3. Upload directly to S3
			const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
			await fetch(url, { method: "PUT", body: file });

			// 3.5. Validate content length/pages before committing any DB records
			const validationRes = await fetch("/api/documents/validate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ key, fileType }),
			});
			const validation = await validationRes.json();

			if (!validation.ok) {
				toast.error(validation.error);
				return; // nothing was created — S3 object is orphaned but harmless, see note below
			}

			// 4. Save PDF to DB
			const doc = await saveDoc.mutateAsync({
				key,
				title: safeFileName,
				fileType,
				fileSize: file.size,
			});

			// 5. Create chat
			const chat = await createChat.mutateAsync({
				title: safeFileName,
				docId: doc.id,
			});

			toast.success("Chat created successfully");
			router.push(`/chat/${chat.id}`);
		} catch (error: any) {
			const errorMessage = error?.message || "Something went wrong";
			toast.error(errorMessage);
			console.error(error);
		}
	};

	const handleChatStart = async (message: string) => {
		if (message.length === 0 || !message) {
			toast.error("please enter a message");
			return;
		}

		try {
			// then send the first message into that chat, same as any other message
			const chat = await createChat.mutateAsync({
				title: message.slice(0, 50), // or however you want to derive a title
			});
			await sendMessage.mutateAsync({
				chatId: chat.id,
				content: message,
				role: "USER",
			});

			router.push(`/chat/${chat.id}`);
		} catch (error) {}
	};

	return (
		<main className="p-4 flex flex-col items-center justify-start gap-6 w-full h-full bg-sidebar">
			<div className="mb-6">
				<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance text-foreground mb-1">
					Chat With Any PDF
				</h1>
				<p className="text-sm leading-none text-muted-foreground">
					Upload your PDF and start chatting with it
				</p>
			</div>

			{/* Upload quota warning for Hobby users */}
			{quota && !quota.canUpload && !quota.pro && (
				<Alert
					variant="destructive"
					className="w-full max-w-4xl"
				>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						<span className="font-medium">Monthly limit reached.</span> You've
						used {quota.uploaded}/{quota.limit} PDF uploads this month.{" "}
						<Link
							href="/billings"
							className="underline font-semibold hover:text-destructive-foreground"
						>
							Upgrade to Pro
						</Link>{" "}
						for unlimited uploads.
					</AlertDescription>
				</Alert>
			)}
			{/* Upload quota info for Hobby users */}
			{quota && quota.canUpload && !quota.pro && quota.limit !== 10000 && (
				<Alert className="w-full max-w-4xl border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
					<AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<AlertDescription className="text-blue-800 dark:text-blue-200">
						<span className="font-medium">Hobby plan:</span> {quota.uploaded}/
						{quota.limit} PDFs uploaded this month. Resets on the 1st.
					</AlertDescription>
				</Alert>
			)}

			{/* ── Mobile: just the chat input with a + upload button ── */}
			<div className="flex md:hidden w-full max-w-xl mx-auto">
				<ChatStartInput onFileUpload={handlePdfUpload} />
			</div>

			{/* ── md+: side-by-side drop zone + chat input ── */}
			<div className="hidden md:flex gap-2 w-full max-w-4xl mx-auto">
				<FileUploadDemo onUpload={handlePdfUpload} />
				<ChatStartInput />
			</div>
		</main>
	);
};

export default ChatPage;
