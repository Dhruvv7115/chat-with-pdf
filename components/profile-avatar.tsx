"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { motion, AnimatePresence } from "motion/react";

const springTransition = {
  type: "spring" as const,
  stiffness: 450,
  damping: 35,
};

const ProfileAvatar = () => {
	const { data } = useSession();
	const user = data?.user;
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

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

	// Close on Escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};
		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown);
		}
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen]);

	if (!user) return null;

	return (
		<div
			ref={containerRef}
			className="relative inline-block"
		>
			<AnimatePresence mode="wait">
				{!isOpen ? (
					/* Trigger: Circular Avatar Button */
					<motion.button
						key="trigger-avatar"
						layoutId="profile-surface"
						transition={springTransition}
						onClick={() => setIsOpen(true)}
						className="rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none relative block"
					>
						<motion.div
							layoutId="profile-avatar-img"
							transition={springTransition}
						>
							<Avatar className="size-9 rounded-full">
								<AvatarImage
									src={user?.avatar}
									alt={user?.name ?? ""}
								/>
								<AvatarFallback>{user?.name?.[0]}</AvatarFallback>
								<AvatarBadge className="bg-emerald-500" />
							</Avatar>
						</motion.div>
					</motion.button>
				) : (
					/* Expanded: Morphed Card */
					<motion.div
						key="profile-menu"
						layoutId="profile-surface"
						transition={springTransition}
						className="absolute right-0 -top-4 w-64 bg-popover text-popover-foreground border border-border rounded-2xl shadow-xl z-50 p-2 overflow-hidden flex flex-col"
					>
						{/* Header: Avatar + User Info */}
						<div
							onClick={() => setIsOpen(false)}
							className="flex items-center gap-2.5 p-1.5 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors select-none"
						>
							<motion.div
								layoutId="profile-avatar-img"
								transition={springTransition}
							>
								<Avatar className="size-9 rounded-lg">
									<AvatarImage
										src={user.avatar ?? ""}
										alt={user.name ?? ""}
									/>
									<AvatarFallback className="rounded-lg">
										{user?.name?.[0] ?? "U"}
									</AvatarFallback>
									<AvatarBadge className="bg-emerald-500" />
								</Avatar>
							</motion.div>

							<div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
								<span className="truncate font-semibold">{user.name}</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>
						</div>

						{/* Menu Items (staggered fade-in) */}
						<motion.div
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 3 }}
							transition={{ duration: 0.16, delay: 0.04 }}
							className="flex flex-col gap-0.5 pt-1.5 border-t border-border mt-1.5"
						>
							<Link
								href="/billings"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-lg hover:bg-muted transition-colors"
							>
								<Sparkles className="size-4 shrink-0 text-amber-500" />
								<span>Upgrade to Pro</span>
							</Link>

							<div className="h-px bg-border my-1" />

							<Link
								href="/chats"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-lg hover:bg-muted transition-colors"
							>
								<IconMessage className="size-4 shrink-0" />
								<span>Chats</span>
							</Link>

							<Link
								href="/settings"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-lg hover:bg-muted transition-colors"
							>
								<BadgeCheck className="size-4 shrink-0" />
								<span>Account</span>
							</Link>

							<Link
								href="/billings"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-lg hover:bg-muted transition-colors"
							>
								<CreditCard className="size-4 shrink-0" />
								<span>Billing</span>
							</Link>

							<div className="h-px bg-border my-1" />

							<button
								type="button"
								onClick={() => signOut({ callbackUrl: "/" })}
								className="flex items-center justify-between w-full px-2.5 py-1.5 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors cursor-pointer text-left"
							>
								<div className="flex items-center gap-2">
									<LogOut className="size-4 shrink-0" />
									<span>Log out</span>
								</div>
								<span className="text-[10px] tracking-widest text-muted-foreground font-mono">
									⇧⌘Q
								</span>
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProfileAvatar;
