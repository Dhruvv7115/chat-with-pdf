"use client";

import {
	BadgeCheck,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
const springTransition = {
  type: "spring" as const,
  stiffness: 450,
  damping: 35,
};
export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLLIElement | null>(null);

	// Close on outside click
	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		if (isOpen) {
			document.addEventListener("mousedown", handleOutsideClick);
		}
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, [isOpen]);

	return (
		<SidebarMenu>
			<SidebarMenuItem
				ref={containerRef}
				className="relative"
			>
				<AnimatePresence mode="wait">
					{!isOpen ? (
						/* Collapsed Trigger Button */
						<motion.button
							key="trigger"
							layoutId="user-menu-surface"
							transition={springTransition}
							onClick={() => setIsOpen(true)}
							className="flex items-center gap-2 w-full p-2 rounded-xl bg-sidebar hover:bg-sidebar-accent text-sidebar-foreground cursor-pointer select-none text-left"
						>
							<motion.div
								layoutId="user-avatar"
								transition={springTransition}
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.avatar}
										alt={user.name}
										referrerPolicy="no-referrer"
									/>
									<AvatarFallback className="rounded-lg">
										{user.name[0]}
									</AvatarFallback>
								</Avatar>
							</motion.div>

							<motion.div
								layoutId="user-info"
								transition={springTransition}
								className="grid flex-1 text-left text-sm leading-tight overflow-hidden"
							>
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</motion.div>

							<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
						</motion.button>
					) : (
						/* Morphed Expanded Card */
						<motion.div
							key="expanded-menu"
							layoutId="user-menu-surface"
							transition={springTransition}
							className="absolute bottom-0 left-0 w-64 bg-sidebar border border-sidebar-border rounded-xl shadow-xl z-50 p-2 overflow-hidden flex flex-col gap-1"
						>
							{/* Header: Morphs seamlessly from the button row */}
							<div
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-2 p-1.5 cursor-pointer rounded-lg hover:bg-sidebar-accent/50"
							>
								<motion.div
									layoutId="user-avatar"
									transition={springTransition}
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={user.avatar}
											alt={user.name}
										/>
										<AvatarFallback className="rounded-lg">
											{user.name[0]}
										</AvatarFallback>
									</Avatar>
								</motion.div>

								<motion.div
									layoutId="user-info"
									transition={springTransition}
									className="grid flex-1 text-left text-sm leading-tight overflow-hidden"
								>
									<span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-xs text-muted-foreground">
										{user.email}
									</span>
								</motion.div>

								<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
							</div>

							{/* Expanded Menu Actions (staggered fade-in) */}
							<motion.div
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 4 }}
								transition={{ duration: 0.15, delay: 0.05 }}
								className="flex flex-col gap-1 pt-1 border-t border-sidebar-border mt-1"
							>
								<Link
									href="/billings"
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
								>
									<Sparkles className="size-4 shrink-0" />
									<span>Upgrade to Pro</span>
								</Link>

								<Link
									href="/settings"
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
								>
									<BadgeCheck className="size-4 shrink-0" />
									<span>Account</span>
								</Link>

								<Link
									href="/billings"
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
								>
									<CreditCard className="size-4 shrink-0" />
									<span>Billing</span>
								</Link>

								<div className="h-px bg-sidebar-border my-1" />

								<button
									type="button"
									onClick={() => signOut({ callbackUrl: "/" })}
									className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left w-full cursor-pointer"
								>
									<LogOut className="size-4 shrink-0" />
									<span>Log out</span>
								</button>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
