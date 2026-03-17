import React, { useRef } from "react";
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
import { ArrowUp } from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";

const ChatInput = ({ chatId }: { chatId?: string }) => {
	const createMessage = api.message.createMessage.useMutation();
	const userMessageRef = useRef<HTMLTextAreaElement | null>(null);

	return (
		<InputGroup className="p-2">
			<InputGroupTextarea
				id="block-end-textarea"
				placeholder="Ask to start a chat..."
				className="text-lg!"
				disabled={createMessage.isPending}
				ref={userMessageRef}
				onChange={() => console.log(userMessageRef.current?.value)}
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
					disabled={createMessage.isPending}
					onClick={() => {
						if (chatId) {
							if (
								userMessageRef.current?.value.trim() === "" ||
								!userMessageRef.current
							) {
								toast.info("Please enter a message");
								return;
							}

							createMessage.mutate({
								chatId,
								content: userMessageRef.current.value,
								role: "USER",
							});
						} else {
							// TODO: add chat creation logic here for /chat page
						}
					}}
				>
					<ArrowUp />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatInput;
