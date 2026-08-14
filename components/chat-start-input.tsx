"use client";
import React, { useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
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
import { ArrowUp } from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const ChatStartInput = () => {
	const [input, setInput] = useState("");
	const startChat = api.chat.createChat.useMutation();
	const addMessage = api.message.createMessage.useMutation();
	const router = useRouter();
	return (
		<InputGroup className="p-2">
			<InputGroupTextarea
				id="block-end-textarea"
				placeholder="Ask to start a chat..."
				className="text-lg!"
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<InputGroupAddon align="block-end">
				<Select>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="Model" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="light">Light</SelectItem>
							<SelectItem value="dark">Dark</SelectItem>
							<SelectItem value="system">System</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<InputGroupButton
					variant="ghost"
					size="sm"
					className="ml-auto rounded-full p-2"
					onClick={async () => {
						if (input) {
							const chat = await startChat.mutateAsync({
								title: input.slice(0, 50),
							});

							if (!chat) {
								toast.error("Failed to create chat");
								return;
							}

							//add the same as message and wait for response
							const message = await addMessage.mutateAsync({
								chatId: chat.id,
								content: input,
								role: "USER",
							});

							if (!message) {
								toast.error("Failed to add message");
								return;
							}

							router.push(`/chat/${chat.id}`);
							setInput("");
						}
					}}
				>
					<ArrowUp />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatStartInput;
