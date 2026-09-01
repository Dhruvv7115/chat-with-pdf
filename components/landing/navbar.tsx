"use client";
import {
	Navbar,
	NavBody,
	NavItems,
	MobileNav,
	NavbarLogo,
	NavbarButton,
	MobileNavHeader,
	MobileNavToggle,
	MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { Button } from "../ui/button";
import { IconBrightness, IconShadow } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavbarDemo() {
	const navItems = [
		{
			name: "Home",
			link: "#hero",
		},
		{
			name: "How it works?",
			link: "#how-it-works",
		},
		{
			name: "Features",
			link: "#features",
		},
		{
			name: "Pricing",
			link: "#pricing",
		},
	];

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<Navbar>
			{/* Desktop Navigation */}
			<NavBody>
				<NavbarLogo />
				<NavItems items={navItems} />
				<div className="flex items-center gap-2">
					<NavbarButton
						href="/signup"
						className={cn(
							"flex items-center justify-center",
							"text-sm font-normal tracking-wide",
							"text-primary-foreground dark:text-secondary-foreground",
							"h-9 w-fit",
							"shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)]",
							"rounded-full px-4",
							"bg-primary hover:bg-primary/80",
							"border border-white/12",
							"transition-all ease-out duration-200 active:scale-95 cursor-pointer",
						)}
					>
						Try for free
					</NavbarButton>
					<ThemeToggle className="z-50" />
				</div>
			</NavBody>

			{/* Mobile Navigation */}
			<MobileNav>
				<MobileNavHeader>
					<NavbarLogo />
					<div className="flex items-center gap-4 justify-center">
						<ThemeToggle className="z-50" />
						<MobileNavToggle
							isOpen={isMobileMenuOpen}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						/>
					</div>
				</MobileNavHeader>

				<MobileNavMenu
					isOpen={isMobileMenuOpen}
					onClose={() => setIsMobileMenuOpen(false)}
				>
					{navItems.map((item, idx) => (
						<Link
							key={`mobile-link-${idx}`}
							href={item.link}
							onClick={() => setIsMobileMenuOpen(false)}
							className="relative text-neutral-600 dark:text-neutral-300"
						>
							<span className="block">{item.name}</span>
						</Link>
					))}
					<div className="flex w-full flex-col gap-4">
						<NavbarButton
							onClick={() => setIsMobileMenuOpen(false)}
							variant="primary"
							href="/login"
							className="w-full"
						>
							Login
						</NavbarButton>
						<NavbarButton
							onClick={() => setIsMobileMenuOpen(false)}
							variant="primary"
							href="/signup"
							className="w-full"
						>
							Book a call
						</NavbarButton>
					</div>
				</MobileNavMenu>
			</MobileNav>
		</Navbar>
	);
}

export const DummyContent = () => {
	return (
		<div className="container mx-auto p-8 pt-24">
			<h1 className="mb-4 text-center text-3xl font-bold">
				Check the navbar at the top of the container
			</h1>
			<p className="mb-10 text-center text-sm text-zinc-500">
				For demo purpose we have kept the position as{" "}
				<span className="font-medium">Sticky</span>. Keep in mind that this
				component is <span className="font-medium">fixed</span> and will not
				move when scrolling.
			</p>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				{[
					{
						id: 1,
						title: "The",
						width: "md:col-span-1",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 2,
						title: "First",
						width: "md:col-span-2",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 3,
						title: "Rule",
						width: "md:col-span-1",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 4,
						title: "Of",
						width: "md:col-span-3",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 5,
						title: "F",
						width: "md:col-span-1",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 6,
						title: "Club",
						width: "md:col-span-2",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 7,
						title: "Is",
						width: "md:col-span-2",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 8,
						title: "You",
						width: "md:col-span-1",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 9,
						title: "Do NOT TALK about",
						width: "md:col-span-2",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
					{
						id: 10,
						title: "F Club",
						width: "md:col-span-1",
						height: "h-60",
						bg: "bg-neutral-100 dark:bg-neutral-800",
					},
				].map((box) => (
					<div
						key={box.id}
						className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm bg-blue-900!`}
					>
						<h2 className="text-xl font-medium">{box.title}</h2>
					</div>
				))}
			</div>
		</div>
	);
};
