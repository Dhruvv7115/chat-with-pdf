import ResizablePdfChat from "@/components/resizable-pdf-chat";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { client } from "@/lib/prisma";
import { getFileUrl } from "@/utils/s3";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ chatId: string }>;
};

const page = async ({ params }: Props) => {
	const { chatId } = await params;
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return redirect("/");
	}
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

	if (session.user.id !== chat.userId) return redirect("/chat");

	return (
		<div className="h-full bg-sidebar">
			<ResizablePdfChat
				doc={doc}
				docUrl={docUrl}
				chat={chat}
			/>
		</div>
	);
};

export default page;
