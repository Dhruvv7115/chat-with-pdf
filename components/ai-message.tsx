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
		<div className="flex items-center justify-start gap-4 w-full h-fit mb-4">
			<div className="rounded-lg lg:px-12 md:px-6 sm:px-4 px-2 py-2 max-w-full prose prose-lime prose-sm prose-li:marker:text-black/50 dark:prose-invert">
				<ReactMarkdown>{message.content}</ReactMarkdown>
			</div>
		</div>
	);
};

export default AiMessage;
