import React from "react";
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
	GalleryVerticalEndIcon,
	LayoutDashboard,
	Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/client";

const sidebarContents = {
	group1: [
		{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
		{ name: "Chat", href: "/chat", icon: Bot },
		{ name: "Billings", href: "/billings", icon: CreditCard },
		{ name: "Settings", href: "/settings", icon: Settings },
	],
	group2: [{ name: "Profile", href: "/profile" }],
};

const AppSidebar = () => {
	const location = usePathname();
	const { data } = useSession();
	const { data: recentPdfs } = api.pdf.getUserPdfs.useQuery();

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
					<SidebarGroupContent className="flex flex-col gap-2">
						{sidebarContents.group1.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									`flex items-center justify-start font-normal gap-2 text-sm px-3 py-1 rounded-md`,
									location === item.href &&
										"bg-primary text-secondary font-semibold",
									location !== item.href && "hover:bg-primary/10",
								)}
							>
								<item.icon className="size-4" />
								{item.name}
							</Link>
						))}
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup id="group-2">
					<SidebarGroupLabel>Recent PDFs</SidebarGroupLabel>
					<SidebarGroupContent className="flex flex-col gap-2 my-2">
						{recentPdfs?.map((pdf) => (
							<Link
								key={pdf.id}
								href={"/dashboard/" + pdf.id}
								className="rounded-lg hover:bg-accent px-2 py-1"
							>
								{pdf.title.length > 20
									? pdf.title.slice(0, 20) + "..."
									: pdf.title}
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
