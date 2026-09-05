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
				"text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
				"text-balance text-center text-primary",
				"font-medium tracking-tighter leading-tighter font-inter",
				"bg-linear-to-br from-olive-600 via-stone-800 to-olive-500 dark:from-olive-400 dark:via-olive-200 dark:to-olive-300 bg-clip-text text-transparent",
			)}
		>
			Chat with your{" "}
			<span className="relative inline-block font-serif italic font-light tracking-wider">
				<motion.span
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
					className="absolute inset-x-0 -bottom-1 lg:-bottom-1.5 xl:h-8 lg:h-7 h-5 -z-10 origin-left bg-lime-400/80 dark:bg-lime-700/80 inline-block"
				/>
				PDFs
			</span>
			<br />
			<span className="relative inline-block">
				<motion.span
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="absolute inset-x-0 -bottom-1 lg:-bottom-1.5 xl:h-8 lg:h-7 h-5 -z-10 origin-left bg-lime-400/80 dark:bg-lime-700/80 inline-block"
				/>
				research papers & reports
			</span>
		</motion.h1>
	);
}
