import { Bot } from "lucide-react";
import React from "react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";

const AiMessage = () => {
	return (
		<div className="flex items-center justify-start gap-4 w-full h-full">
			<Avatar>
				<AvatarImage
					src="/message-bot.png"
					alt="@evilrabbit"
				/>
				<AvatarFallback>ER</AvatarFallback>
				<AvatarBadge className="bg-green-600 dark:bg-green-800" />
			</Avatar>
			<div className="bg-neutral-200 rounded-lg w-fit flex items-center justify-center py-2 px-4 text-base">
				hello
			</div>
		</div>
	);
};

export default AiMessage;
