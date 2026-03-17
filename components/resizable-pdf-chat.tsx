"use client";
import React, { useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatAi from "./chat-ai";
import dynamic from "next/dynamic";
const ReactPdf = dynamic(() => import("./react-pdf"), { ssr: false });

type Chat = {
	id: string;
	title: string;
	userId: string;
	pdfId: string;
	createdAt: Date;
	updatedAt: Date;
};
type Pdf = {
	userId: string;
	title: string;
	id: string;
	createdAt: Date;
	updatedAt: Date;
	fileKey: string;
	fileSize: number | null;
	pageCount: number | null;
} | null;

const ResizablePdfChat = ({
	pdf,
	chat,
	pdfUrl,
}: {
	pdf?: Pdf;
	chat: Chat;
	pdfUrl?: string;
}) => {
	return (
		<ResizablePanelGroup
			orientation="horizontal"
			className="w-full h-full"
		>
			<ResizablePanel
				defaultSize={50}
				className="h-full overflow-hidden"
			>
				<ReactPdf pdfUrl={pdfUrl || ""} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel
				defaultSize={50}
				className="h-full overflow-hidden"
			>
				<ChatAi chat={chat} pdfUrl={pdfUrl} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default ResizablePdfChat;
