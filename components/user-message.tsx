"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
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
		<div className="flex items-start justify-end gap-4 w-full h-fit mb-4">
			<div className="bg-primary rounded-lg w-fit flex items-center justify-center py-2 px-4 text-base text-secondary max-w-[80%]">
				{message.content}
			</div>
			<Avatar className="h-8 w-8 rounded-lg">
				<AvatarImage
					src={user.avatar}
					alt={user?.name || ""}
					referrerPolicy="no-referrer"
				/>
				<AvatarFallback className="rounded-lg">
					{user?.name?.[0] ?? "CN"}
				</AvatarFallback>
			</Avatar>
		</div>
	);
};

export default UserMessage;
