import React, { useState } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
} from "./ui/sidebar";
import Link from "next/link";
import {
	Bot,
	CreditCard,
	Files,
	GalleryVerticalEndIcon,
	LayoutDashboard,
	Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/client";
import { motion } from "motion/react";

const sidebarContents = {
	group1: [
		{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
		{ name: "Chat", href: "/chat", icon: Bot },
		{ name: "Documents", href: "/docs", icon: Files },
		{ name: "Billings", href: "/billings", icon: CreditCard },
		{ name: "Settings", href: "/settings", icon: Settings },
	],
	group2: [{ name: "Profile", href: "/profile" }],
};

const AppSidebar = () => {
	const location = usePathname();
	const { data } = useSession();
	const { data: recentDocs } = api.pdf.getUserDocs.useQuery();
	const [hovered, setHovered] = useState<string>("");

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<div className="flex justify-center gap-2 md:justify-start p-2">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-lg"
					>
						<div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEndIcon className="size-5" />
						</div>
						ChatWithPDF
					</Link>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup id="group-1">
					<SidebarGroupContent className="flex flex-col">
						{sidebarContents.group1.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								onMouseEnter={() => setHovered(item.name)}
								onMouseLeave={() => setHovered("")}
								className={cn(
									"flex items-center justify-start font-normal gap-2 text-sm px-4 py-2 rounded-md relative z-50 bg-transparent",
									location === item.href &&
										"bg-primary text-secondary font-medium",
								)}
							>
								{hovered === item.name && location !== item.href && (
									<motion.span
										className="absolute inset-0 -z-20 bg-neutral-500/10 rounded-md"
										layoutId="hovered-span"
										transition={{
											type: "tween",
											duration: 0.3,
										}}
									/>
								)}
								<item.icon className="size-5" />
								<motion.span
									animate={{
										x: hovered === item.name && location !== item.href ? 4 : 0,
									}}
									transition={{ type: "tween", duration: 0.2 }}
								>
									{item.name}
								</motion.span>
							</Link>
						))}
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup id="group-2">
					<SidebarGroupLabel>Recent Documents</SidebarGroupLabel>
					<SidebarGroupContent className="flex flex-col gap-2 my-2">
						{recentDocs?.map((doc) => (
							<Link
								key={doc.id}
								href={"/chat/" + doc.id}
								className="rounded-lg hover:bg-accent px-2 py-1"
							>
								{doc.title.length > 20
									? doc.title.slice(0, 20) + "..."
									: doc.title}
							</Link>
						))}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: data?.user?.name ?? "John Doe",
						email: data?.user?.email ?? "0Hc0R@example.com",
						avatar: data?.user?.avatar ?? "",
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
