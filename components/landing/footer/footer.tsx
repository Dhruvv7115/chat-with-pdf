"use client";

import React from "react";
import Link from "next/link";
import { GalleryVerticalEndIcon } from "lucide-react";
import FlickeringGrid from "./flickering-grid";

const navColumns = [
	{
		title: "Company",
		links: [
			{ name: "About", href: "#" },
			{ name: "Contact", href: "#" },
			{ name: "Blog", href: "#" },
			{ name: "Story", href: "#" },
		],
	},
	{
		title: "Products",
		links: [
			{ name: "Company", href: "#" },
			{ name: "Product", href: "#" },
			{ name: "Press", href: "#" },
			{ name: "More", href: "#" },
		],
	},
	{
		title: "Resources",
		links: [
			{ name: "Press", href: "#" },
			{ name: "Careers", href: "#" },
			{ name: "Newsletters", href: "#" },
			{ name: "More", href: "#" },
		],
	},
];

export function Footer() {
	return (
		<footer className="w-full bg-background text-foreground relative overflow-hidden">
			{/* Top Container */}
			<div className="mx-auto w-full max-w-7xl px-8 pt-16 pb-8 md:px-12">
				<div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
					{/* Left Section: Brand, Description, Badges */}
					<div className="flex flex-col gap-5 max-w-md">
						{/* Logo */}
						<Link
							href="/"
							className="flex items-center gap-2.5 w-fit group"
						>
							<div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
								<GalleryVerticalEndIcon className="size-4" />
							</div>
							<span className="font-bold text-xl tracking-tight text-foreground">
								ChatWithPDF
							</span>
						</Link>

						{/* Tagline / Description */}
						<p className="tracking-tight text-muted-foreground font-medium">
							AI assistant designed to streamline your digital workflows and
							handle mundane tasks, so you can focus on what truly matters
						</p>
					</div>

					{/* Right Section: 3 Navigation Columns */}
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-16">
						{navColumns.map((col) => (
							<div
								key={col.title}
								className="flex flex-col gap-4 min-w-[100px]"
							>
								<h4 className="text-sm font-semibold text-foreground tracking-tight">
									{col.title}
								</h4>
								<ul className="flex flex-col gap-3">
									{col.links.map((link, idx) => (
										<li key={`${col.title}-${idx}`}>
											<Link
												href={link.href}
												className="text-sm text-muted-foreground transition-colors hover:text-foreground"
											>
												{link.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Flickering Grid Section at the bottom */}
			<div className="relative z-0 mt-24 h-48 w-full md:h-64">
				{/* Top Fade Gradient (Fades into background upwards) */}
				<div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-transparent to-background from-40%" />

				{/* Grid Container */}
				<div className="absolute inset-0 mx-6">
					<FlickeringGrid
						color="#6B7280"
						squareSize={2}
						gridGap={3}
						flickerChance={0.08}
						maxOpacity={0.25}
						className="h-full w-full"
					/>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
