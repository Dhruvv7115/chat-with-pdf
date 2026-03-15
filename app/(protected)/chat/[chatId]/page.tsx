import ResizablePdfChat from "@/components/resizable-pdf-chat";
import { client } from "@/lib/prisma";
import { getFileUrl } from "@/utils/s3";
import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ chatId: string }>;
};

const page = async ({ params }: Props) => {
	const { chatId } = await params;
	const chat = await client.chat.findUnique({ where: { id: chatId } });
	if (!chat) return redirect("/chat");
	let pdf;
	let pdfUrl;
	if (chat.pdfId) {
		pdf = await client.pdf.findUnique({ where: { id: chat.pdfId } });
		if (pdf) {
			pdfUrl = await getFileUrl(pdf.fileKey);
		}
	}
	return (
		<div className="h-full overflow-hidden">
			<ResizablePdfChat
				pdf={pdf}
				pdfUrl={pdfUrl}
				chat={chat}
			/>
		</div>
	);
};

export default page;
