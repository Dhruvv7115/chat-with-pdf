import React from "react";
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
const ChatStartInput = () => {
	return (
		<InputGroup className="p-2">
			<InputGroupTextarea
				id="block-end-textarea"
				placeholder="Ask to start a chat..."
				className="text-lg!"
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
					onClick={() => {
						
					}}
				>
					<ArrowUp />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default ChatStartInput;
