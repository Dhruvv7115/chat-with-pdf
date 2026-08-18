"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
	words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
	duration = 3000,
}: {
	words: string[];
	duration?: number;
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
		}, duration);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<motion.span
				layout
				className="relative w-fit overflow-hidden rounded-md md:px-2 md:py-1 px-1 py-0.5 font-sans text-xs font-medium tracking-tight text-neutral-600 dark:text-neutral-300 drop-shadow-md md:text-sm bg-neutral-200/40 dark:bg-neutral-800/40 border border-neutral-300/20 dark:border-neutral-900/20"
			>
				<AnimatePresence mode="popLayout">
					<motion.span
						key={currentIndex}
						initial={{ y: -40, filter: "blur(10px)" }}
						animate={{
							y: 0,
							filter: "blur(0px)",
						}}
						exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
						transition={{
							duration: 0.5,
						}}
						className={cn("inline-block whitespace-nowrap")}
					>
						{words[currentIndex]}
					</motion.span>
				</AnimatePresence>
			</motion.span>
		</>
	);
};
