import { Bot } from "lucide-react";
import React from "react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Role } from "@/lib/generated/prisma/enums";
import ReactMarkdown from "react-markdown";
type Message = {
	id: string;
	role: Role;
	content: string;
	createdAt: string;
	updatedAt: string;
	chatId: string;
};
const AiMessage = ({ message }: { message: Message }) => {
	return (
		<div className="flex items-start justify-start gap-4 w-full h-fit">
			<Avatar>
				<AvatarImage
					src="/message-bot.png"
					alt="@evilrabbit"
				/>
				<AvatarFallback>ER</AvatarFallback>
				<AvatarBadge className="bg-green-600 dark:bg-green-800" />
			</Avatar>
			<div className="bg-muted rounded-lg w-fit py-2 px-4 max-w-[80%] prose prose-lime prose-sm prose-li:marker:text-black/50 dark:prose-invert">
				<ReactMarkdown>{message.content}</ReactMarkdown>
			</div>
		</div>
	);
};

export default AiMessage;
