"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
	content,
	contentClassName,
}: {
	content: {
		title: string;
		description: string;
		content?: React.ReactNode | any;
	}[];
	contentClassName?: string;
}) => {
	const [activeCard, setActiveCard] = React.useState(0);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const observers: IntersectionObserver[] = [];

		cardRefs.current.forEach((el, index) => {
			if (!el) return;

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							setActiveCard(index);
						}
					});
				},
				{
					rootMargin: "-25% 0px -40% 0px",
					threshold: 0.1,
				},
			);

			observer.observe(el);
			observers.push(observer);
		});

		return () => {
			observers.forEach((obs) => obs.disconnect());
		};
	}, [content.length]);

	const backgroundColors = [
		"#0f172a", // slate-900
		"#000000", // black
		"#171717", // neutral-900
	];
	const linearGradients = [
		"linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan-500 to emerald-500
		"linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
		"linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
	];

	return (
		<motion.div
			animate={{
				backgroundColor: backgroundColors[activeCard % backgroundColors.length],
			}}
			className="relative flex justify-between items-start space-x-10 p-6 md:p-10"
		>
			{/* Left Column: Scrolling Text Items */}
			<div className="relative flex items-start px-4 w-full lg:w-1/2">
				<div className="max-w-2xl w-full">
					{content.map((item, index) => (
						<div
							key={item.title + index}
							ref={(el) => {
								cardRefs.current[index] = el;
							}}
							className="min-h-[50vh] flex flex-col justify-center py-10 first:pt-4 last:pb-20"
						>
							<motion.h2
								initial={{ opacity: 0 }}
								animate={{
									opacity: activeCard === index ? 1 : 0.25,
								}}
								transition={{ duration: 0.2 }}
								className="text-2xl md:text-3xl font-bold text-slate-100"
							>
								{item.title}
							</motion.h2>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{
									opacity: activeCard === index ? 1 : 0.25,
								}}
								transition={{ duration: 0.2 }}
								className="text-base md:text-lg mt-5 max-w-md text-slate-300 leading-relaxed"
							>
								{item.description}
							</motion.p>
						</div>
					))}
				</div>
			</div>

			{/* Right Column: Sticky Card Positioned Safely Below Navbar */}
			<motion.div
				animate={{
					background: linearGradients[activeCard % linearGradients.length],
				}}
				className={cn(
					"sticky top-32 hidden h-72 w-[24rem] xl:h-80 xl:w-md overflow-hidden rounded-2xl bg-white shadow-2xl lg:block transition-all duration-300",
					contentClassName,
				)}
			>
				{content[activeCard]?.content ?? null}
			</motion.div>
		</motion.div>
	);
};
