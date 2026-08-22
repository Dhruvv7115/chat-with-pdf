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

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const ResizablePdfChat = ({
	doc,
	chat,
	docUrl,
}: {
	doc?: Doc | null;
	chat: Chat;
	docUrl?: string;
}) => {
	const isMobile = useIsMobile();
	const [activeTab, setActiveTab] = useState<"doc" | "chat">("chat");

	if (!docUrl || !doc) {
		return (
			<div className="flex h-full w-full">
				<ChatAi
					chat={chat}
					docUrl={docUrl}
					doc={doc}
				/>
			</div>
		);
	}

	if (isMobile) {
		return (
			<div className="flex flex-col h-full w-full overflow-hidden bg-sidebar">
				{/* Tab Toggles */}
				<div className="flex border-b border-border p-2 gap-2 bg-sidebar shrink-0">
					<button
						onClick={() => setActiveTab("doc")}
						className={cn(
							"flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer",
							activeTab === "doc"
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800",
						)}
					>
						Document
					</button>
					<button
						onClick={() => setActiveTab("chat")}
						className={cn(
							"flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer",
							activeTab === "chat"
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800",
						)}
					>
						Chat
					</button>
				</div>

				{/* Active View */}
				<div className="flex-1 overflow-auto relative">
					{activeTab === "doc" ? (
						<div className="h-full w-full overflow-auto">
							{doc?.fileType === FileType.PDF ? (
								<ReactPdf docUrl={docUrl || ""} />
							) : (
								<MarkdownViewer
									docUrl={docUrl || ""}
									doc={doc}
								/>
							)}
						</div>
					) : (
						<div className="h-full w-full">
							<ChatAi
								chat={chat}
								docUrl={docUrl}
								doc={doc}
							/>
						</div>
					)}
				</div>
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
					<MarkdownViewer
						docUrl={docUrl || ""}
						doc={doc}
					/>
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
