"use client";
import FileUploadDemo from "@/components/file-upload-demo";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ChatStartInput from "@/components/chat-start-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const ChatPage = () => {
	const uploadPdf = api.pdf.getUploadUrl.useMutation();
	const savePdf = api.pdf.savePdf.useMutation();
	const createChat = api.chat.createChat.useMutation();
	const router = useRouter();

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
		} catch (error: any) {
			const errorMessage = error?.message || "Something went wrong";
			toast.error(errorMessage);
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

			<div className="flex gap-2 w-full max-w-4xl mx-auto">
				<FileUploadDemo onUpload={handlePdfUpload} />
				<ChatStartInput />
			</div>
		</main>
	);
};

export default ChatPage;
