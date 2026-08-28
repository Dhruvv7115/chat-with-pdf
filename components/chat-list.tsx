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
import { usePathname, useRouter } from "next/navigation";
import ChatLinkItem from "./chat-link-item";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { IconMessage, IconPlus } from "@tabler/icons-react";
import { Button } from "./ui/button";

const ChatList = () => {
	const { data: recentChats } = api.chat.getUserChats.useQuery({ limit: 20 });
	const pathname = usePathname();
	const router = useRouter();

	return (
		<SidebarGroup className="overflow-y-auto scrollbar-none pt-6 mask-alpha mask-t-from-90% mask-t-to-100%">
			<Collapsible
				className="group/collapsible"
				defaultOpen
			>
				<SidebarMenu>
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton className="py-2 group/btn">
								<span className="text-sm font-medium dark:text-neutral-300 text-neutral-600">
									Recent Chats
								</span>
								<ChevronRight className="opacity-0 transition-all duration-200 group-hover/btn:opacity-100 group-data-[state=open]/collapsible:rotate-90 text-neutral-500 dark:hover:text-neutral-400 hover:text-neutral-600" />
								<Link
									href="/chats"
									className="ml-auto p-1 hover:bg-black/20 rounded cursor-pointer text-neutral-500 dark:hover:text-neutral-300 hover:text-neutral-600"
								>
									<ArrowUpRight className="opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100" />
								</Link>
							</SidebarMenuButton>
						</CollapsibleTrigger>

						<CollapsibleContent>
							<div className="flex flex-col gap-0 w-full">
								{recentChats?.length === 0 && (
									<Empty className="border border-neutral-300 dark:border-neutral-700 mt-4">
										<EmptyHeader>
											<EmptyMedia variant="icon">
												<IconMessage className="size-5" />
											</EmptyMedia>
											<EmptyTitle>No Recent Chats</EmptyTitle>
											<EmptyDescription>
												Start a conversation to see your recent chats here.
											</EmptyDescription>
										</EmptyHeader>	
										<EmptyContent>
											<Button
												variant="outline"
												size="sm"
												onClick={() => router.push("/chat")}
												className="cursor-pointer"
											>
												<IconPlus className="size-3 mr-1" />
												Start a Conversation
											</Button>
										</EmptyContent>
									</Empty>
								)}
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
