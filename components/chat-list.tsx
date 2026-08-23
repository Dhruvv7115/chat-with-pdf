import { useRef, useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/client";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";
import { usePathname } from "next/navigation";
import ChatLinkItem from "./chat-link-item";

const ChatList = () => {
	const { data: recentChats } = api.chat.getUserChats.useQuery({ limit: 15 });
	const pathname = usePathname();

	return (
		<SidebarGroup className="overflow-y-auto scrollbar-none pt-6 mask-alpha mask-t-from-90% mask-t-to-100%">
			<Collapsible className="group/collapsible">
				<SidebarMenu>
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton className="py-2 group/btn">
								<span className="text-sm font-medium dark:text-neutral-300 text-neutral-600">Recent Chats</span>
								<ChevronRight className="opacity-0 transition-all duration-200 group-hover/btn:opacity-100 group-data-[state=open]/collapsible:rotate-90 text-neutral-500 dark:hover:text-neutral-400 hover:text-neutral-600" />
								<Link
									href="/chat"
									className="ml-auto p-1 hover:bg-black/20 rounded cursor-pointer text-neutral-500 dark:hover:text-neutral-300 hover:text-neutral-600"
								>
									<ArrowUpRight className="opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100" />
								</Link>
							</SidebarMenuButton>
						</CollapsibleTrigger>

						<CollapsibleContent>
							<div className="flex flex-col gap-0 w-full">
								{recentChats?.map((chat) => (
									<ChatLinkItem
										key={chat.id}
										chat={chat}
										isActive={pathname === `/chat/${chat.id}`}
									/>
								))}
							</div>
						</CollapsibleContent>
					</SidebarMenuItem>
				</SidebarMenu>
			</Collapsible>
		</SidebarGroup>
	);
};

export default ChatList;
