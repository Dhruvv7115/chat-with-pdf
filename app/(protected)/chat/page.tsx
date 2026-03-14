"use client";
import FileUploadDemo from "@/components/file-upload-demo";
import React from "react";
import ChatInput from "@/components/chat-input";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { create } from "node:domain";
import { useRouter } from "next/navigation";

const ChatPage = () => {
	const uploadPdf = api.pdf.getUploadUrl.useMutation();
	const savePdf = api.pdf.savePdf.useMutation();
	const createChat = api.chat.createChat.useMutation();
	const router = useRouter();

	// await Promise.all(
	// 	files.map(async (file) => {
	// 		await createPdf.mutateAsync(
	// 			{
	// 				name: file.name,
	// 				type: file.type,
	// 				size: file.size,
	// 			},
	// 			{
	// 				onSuccess: (data) => {
	// 					fetch(data.url, {
	// 						method: "PUT",
	// 						body: file,
	// 					}).then(() => {
	// 						toast.success("File uploaded successfully");
	// 					});
	// 				},
	// 				onError: (error) => {
	// 					toast.error("Something went wrong");
	// 					console.log(error);
	// 				},
	// 			},
	// 		);
	// 	}),
	// );
	const handlePdfUpload = async (files: File[]) => {
		if (!files.length) return;
		if (files.length > 1) {
			toast.error("Only one file at a time is allowed");
			return;
		}

		const file = files[0];

		try {
			// 1. Get pre-signed upload URL
			const { url, key } = await uploadPdf.mutateAsync({
				name: file.name,
				type: file.type,
				size: file.size,
			});

			const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

			// 2. Upload directly to S3
			await fetch(url, { method: "PUT", body: file });

			// 3. Save PDF to DB
			const pdf = await savePdf.mutateAsync({
				key,
				title: safeFileName,
			});

			// 4. Create chat
			const chat = await createChat.mutateAsync({
				title: safeFileName,
				pdfId: pdf.id,
			});

			toast.success("Chat created successfully");
			router.push(`/chat/${chat.id}`);
		} catch (error) {
			toast.error("Something went wrong");
			console.error(error);
		}
	};
	return (
		<main className="p-4 flex flex-col items-center justify-start gap-6 w-full h-full">
			<div className="mb-6">
				<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance text-foreground mb-1">
					Chat With Any PDF
				</h1>
				<p className="text-sm leading-none text-muted-foreground">
					Upload your PDF and start chatting with it
				</p>
			</div>

			<div className="flex gap-2 w-full max-w-4xl mx-auto">
				<FileUploadDemo onUpload={handlePdfUpload} />
				<ChatInput />
			</div>
		</main>
	);
};

export default ChatPage;
