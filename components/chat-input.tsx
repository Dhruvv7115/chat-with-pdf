import React, { useRef, useState } from "react";
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

const ChatInput = ({
	chatId,
	setAiResponse,
}: {
	chatId: string;
	setAiResponse: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const utils = api.useUtils();
	const createMessage = api.message.createMessage.useMutation();
	const aiResponseRef = useRef<string>("");

	const [question, setQuestion] = useState(""); // controls the input

	return (
		<InputGroup className="p-2">
			<InputGroupTextarea
				id="block-end-textarea"
				placeholder="Ask to start a chat..."
				className=""
				disabled={createMessage.isPending}
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
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
						createMessage
							.mutateAsync({
								chatId,
								content: question,
								role: "USER",
							})
							.then(() => {
								setQuestion("");
								utils.chat.getMessages.invalidate();
								fetch("/api/ai/chat", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({
										chatId,
										question,
									}),
								}).then(async (res) => {
									const reader = res.body?.getReader();
									const decoder = new TextDecoder();

									while (true) {
										const { done, value } = await reader!.read();
										if (done) break;
										setAiResponse((p) => p + decoder.decode(value));
										aiResponseRef.current += decoder.decode(value);
									}
									await createMessage.mutateAsync({
										chatId,
										content: aiResponseRef.current,
										role: "ASSISTANT",
									});
									aiResponseRef.current = "";
									setAiResponse("");
									utils.chat.getMessages.invalidate();
								});
							});
					}}
				>
					<ArrowUp />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatInput;
