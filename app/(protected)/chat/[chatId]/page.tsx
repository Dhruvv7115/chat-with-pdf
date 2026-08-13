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
	let doc;
	let docUrl;
	if (chat.documentId) {
		doc = await client.document.findUnique({ where: { id: chat.documentId } });
		if (doc) {
			docUrl = await getFileUrl(doc.fileKey);
		}
	}

	return (
		<div className="h-full overflow-hidden">
			<ResizablePdfChat
				doc={doc}
				docUrl={docUrl}
				chat={chat}
			/>
		</div>
	);
};

export default page;
