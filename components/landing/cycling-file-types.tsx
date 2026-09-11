"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const FILE_TYPES = ["PDF", "DOCX", "TXT", "MD"];
const HOLD_MS = 3000;

export function CyclingFileType() {
	const [index, setIndex] = useState(0);
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		if (prefersReducedMotion) return;
		const interval = setInterval(() => {
			setIndex((i) => (i + 1) % FILE_TYPES.length);
		}, HOLD_MS);

		return () => clearInterval(interval);
	}, [prefersReducedMotion]);

	const word = prefersReducedMotion ? "PDF" : FILE_TYPES[index];

	return (
		<span className="relative w-fit overflow-hidden rounded-lg border border-transparent bg-white px-2 py-1 font-sans font-bold tracking-tight text-black shadow-sm ring shadow-black/10 ring-black/10 drop-shadow-lg dark:bg-neutral-900 dark:text-white dark:shadow-sm dark:ring-1 dark:shadow-white/10 dark:ring-white/10">
			<AnimatePresence mode="popLayout">
				<motion.span
					className="inline-block whitespace-nowrap"
					key={FILE_TYPES[index]}
					initial={{ y: 20, filter: "blur(10px)" }}
					animate={{
						y: 0,
						filter: "blur(0px)",
					}}
					exit={{ y: -20, filter: "blur(10px)", opacity: 0 }}
					transition={{
						duration: 0.5,
					}}
				>
					{word}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}
