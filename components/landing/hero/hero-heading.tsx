"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HeroHeading() {
	return (
		<motion.h1
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
			className={cn(
				"md:text-6xl text-5xl",
				"font-bold tracking-tight bg-linear-to-br dark:bg-linear-to-br from-olive-800 to-rose-800 dark:from-olive-200 dark:to-olive-400 bg-clip-text text-transparent text-wrap text-center max-w-4xl",
				"tracking-tighter leading-tighter font-inter",
			)}
		>
			Chat with your{" "}
			<span className="relative inline-block font-serif italic font-medium tracking-wider">
				<motion.span
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
					className="absolute inset-x-0 bottom-0 h-8 -z-10 origin-left bg-lime-400/80 dark:bg-lime-700/80 hidden sm:inline-block"
				/>
				PDFs
			</span>
			<br />
			<span className="relative inline-block">
				<motion.span
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="absolute inset-x-0 bottom-0 h-7 -z-10 origin-left bg-lime-400/80 dark:bg-lime-700/80 hidden sm:inline-block"
				/>
				research papers & reports
			</span>
		</motion.h1>
	);
}
