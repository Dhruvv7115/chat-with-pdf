import React from "react";
import AiMessage from "./ai-message";
import UserMessage from "./user-message";
import ChatInput from "./chat-input";

const ChatAi = () => {
	return (
		<div className="flex flex-col w-full h-full overflow-y-auto justify-between py-4">
			<div className="px-4 py-2">
				<AiMessage />
				<UserMessage />
			</div>
      <div className="px-4 py-2">
        <ChatInput />
      </div>
		</div>
	);
};

export default ChatAi;
