"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BadgeCheck, CreditCard, LogOut, Sparkles } from "lucide-react";
import { IconMessage } from "@tabler/icons-react";

const ProfileAvatar = () => {
	const { data } = useSession();
	const user = data?.user;
	if (!user) return null;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="icon"
					className="rounded-full cursor-pointer"
				>
					<Avatar>
						<AvatarImage
							src={user?.avatar}
							alt={user?.name ?? ""}
						/>
						<AvatarFallback>{user?.name?.[0]}</AvatarFallback>
						<AvatarBadge className="bg-green-600 dark:bg-green-800" />
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-60 w-(--radix-dropdown-menu-trigger-width) rounded-lg">
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={user.avatar ?? ""}
								alt={user.name ?? ""}
							/>
							<AvatarFallback className="rounded-lg">{user?.name?.[0] ?? "CN"}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{user.name}</span>
							<span className="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link href="/billings">
						<DropdownMenuItem>
							<Sparkles />
							Upgrade to Pro
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuGroup>
					<Link href="/chats">
						<DropdownMenuItem>
							<IconMessage />
							Chats
						</DropdownMenuItem>
					</Link>
					<Link href="/settings">
						<DropdownMenuItem>
							<BadgeCheck />
							Account
						</DropdownMenuItem>
					</Link>
					<Link href="/billings">
						<DropdownMenuItem>
							<CreditCard />
							Billing
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => signOut}>
					<LogOut />
					<span>Log out</span>
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileAvatar;
