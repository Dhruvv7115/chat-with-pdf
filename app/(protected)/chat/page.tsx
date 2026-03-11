import FileUploadDemo from "@/components/file-upload-demo";
import React from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import ChatInput from "@/components/chat-input";

const ChatPage = () => {
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
				<FileUploadDemo />
				<ChatInput />
			</div>
		</main>
	);
};

export default ChatPage;
