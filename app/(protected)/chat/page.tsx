"use client";
import React, { useState } from "react";
import FileUploadDemo from "@/components/file-upload-demo";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ChatStartInput from "@/components/chat-start-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { getFileType } from "@/utils/file-type";
import { uploadFileWithAxios } from "@/utils/upload-file";

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

	// Upload progress for the dropzone component
	const [dropzoneProgress, setDropzoneProgress] = useState<number | undefined>(
		undefined,
	);
	const [dropzoneState, setDropzoneState] = useState<
		"idle" | "uploading" | "processing" | "done" | "error"
	>("idle");

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
			// 1. Check file type
			const fileType = getFileType(file);
			if (!fileType) {
				toast.error(
					"File type not supported please try uploading one of the supported file types - [MD, PDF, DOCX, TXT, CSV]",
				);
				return;
			}

			setDropzoneState("uploading");
			setDropzoneProgress(0);

			// 2. Get pre-signed upload URL
			const { url, key } = await uploadDoc.mutateAsync({
				name: file.name,
				type: file.type,
				size: file.size,
			});

			// 3. Upload directly to S3 via axios with real-time percentage progress
			const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
			await uploadFileWithAxios(url, file, (percent) => {
				setDropzoneProgress(percent);
			});

			setDropzoneProgress(100);
			setDropzoneState("processing");

			// 3.5. Validate content length/pages before committing any DB records
			const validationRes = await fetch("/api/documents/validate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ key, fileType }),
			});
			const validation = await validationRes.json();

			if (!validation.ok) {
				setDropzoneState("error");
				toast.error(validation.error);
				return;
			}

			// 4. Save PDF to DB
			const doc = await saveDoc.mutateAsync({
				key,
				title: safeFileName,
				fileType,
				fileSize: file.size,
			});

			setDropzoneState("done");

			// 5. Create chat
			const chat = await createChat.mutateAsync({
				title: safeFileName,
				docId: doc.id,
			});

			toast.success("Chat created successfully");
			router.push(`/chat/${chat.id}`);
		} catch (error: any) {
			setDropzoneState("error");
			const errorMessage = error?.message || "Something went wrong";
			toast.error(errorMessage);
			console.error(error);
		}
	};

	return (
		<main className="p-4 flex flex-col items-center justify-center gap-6 w-full h-full bg-sidebar pb-32">
			<div className="mb-6">
				<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance text-foreground mb-1">
					Chat With Any PDF
				</h1>
				<p className="text-sm leading-none text-muted-foreground">
					Upload your PDF and start chatting with it
				</p>
			</div>

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
			
			{quota && quota.canUpload && !quota.pro && quota.limit !== 10000 && (
				<Alert className="w-full max-w-4xl border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
					<AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<AlertDescription className="text-blue-800 dark:text-blue-200">
						<span className="font-medium">Hobby plan:</span> {quota.uploaded}/
						{quota.limit} PDFs uploaded this month. Resets on the 1st.
					</AlertDescription>
				</Alert>
			)}

			<div className="flex md:hidden w-full max-w-xl mx-auto">
				<ChatStartInput />
			</div>

			<div className="hidden md:flex gap-4 w-full max-w-4xl mx-auto">
				<FileUploadDemo
					onUpload={handlePdfUpload}
					progress={dropzoneProgress}
					uploadState={dropzoneState}
				/>
				<ChatStartInput showAttachment={false} />
			</div>
		</main>
	);
};

export default ChatPage;
