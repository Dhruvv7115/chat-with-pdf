"use client";
import { Role } from "@/lib/generated/prisma/enums";
import { Bubble, BubbleContent } from "./ui/bubble";
import { usePreferences } from "@/hooks/use-preferences";
import { cn } from "@/lib/utils";
type Message = {
	id: string;
	role: Role;
	content: string;
	createdAt: string;
	updatedAt: string;
	chatId: string;
};
const UserMessage = ({ message }: { message: Message }) => {
	const { preferences } = usePreferences();
	return (
		<div
			className={cn(
				"flex items-center justify-end gap-4 w-full max-w-full h-fit mb-4 md:px-4 px-2",
				`font-${preferences.fontStyle}`,
			)}
			style={
				{
					"--typeset-size": `${preferences.fontSize ?? "16px"}`,
				} as React.CSSProperties
			}
		>
			<Bubble variant="tinted">
				<BubbleContent>{message.content}</BubbleContent>
			</Bubble>
		</div>
	);
};

export default UserMessage;
