"use client";
import { useSession } from "next-auth/react";
import { Role } from "@/lib/generated/prisma/enums";
import { Bubble, BubbleContent } from "./ui/bubble";
type Message = {
	id: string;
	role: Role;
	content: string;
	createdAt: string;
	updatedAt: string;
	chatId: string;
};
const UserMessage = ({ message }: { message: Message }) => {
	const { data: session } = useSession();
	if (!session) return null;
	const user = session.user;

	return (
		<div className="flex items-center justify-end gap-4 w-full max-w-full h-fit mb-4 md:px-4 px-2">
			<Bubble>
				<BubbleContent>{message.content}</BubbleContent>
			</Bubble>
		</div>
	);

};

export default UserMessage;
