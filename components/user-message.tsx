"use client";
import { useSession } from "next-auth/react";
import { Role } from "@/lib/generated/prisma/enums";
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
		<div className="flex items-center justify-end gap-4 w-full max-w-full h-fit mb-4 pr-4">
			<div className="bg-primary rounded-lg w-fit max-w-[80%] flex items-center justify-center py-2 px-4 text-sm text-secondary">
				{message.content}
			</div>
		</div>
	);
};

export default UserMessage;
