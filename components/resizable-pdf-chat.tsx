"use client";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatAi from "./chat-ai";
import dynamic from "next/dynamic";
const ReactPdf = dynamic(() => import("./react-pdf"), { ssr: false });
import type { Doc, Chat } from "./chat-ai";
import MarkdownViewer from "./markdown-viewer";
import { FileType } from "@/lib/generated/prisma/enums";

const ResizablePdfChat = ({
	doc,
	chat,
	docUrl,
}: {
	doc?: Doc | null;
	chat: Chat;
	docUrl?: string;
}) => {
	if (!docUrl || !doc) {
		return (
			<div className="flex h-full">
				<ChatAi
					chat={chat}
					docUrl={docUrl}
					doc={doc}
				/>
			</div>
		);
	}
	return (
		<ResizablePanelGroup
			orientation="horizontal"
			className="w-full h-full"
		>
			<ResizablePanel
				defaultSize={50}
				className="h-full overflow-hidden"
			>
				{doc?.fileType === FileType.PDF ? (
					<ReactPdf docUrl={docUrl || ""} />
				) : (
					<MarkdownViewer docUrl={docUrl || ""} />
				)}
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel
				defaultSize={50}
				className="h-full overflow-hidden"
			>
				<ChatAi
					chat={chat}
					docUrl={docUrl}
					doc={doc}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default ResizablePdfChat;
