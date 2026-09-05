"use client";
import { motion } from "motion/react";
const SectionHeader = ({
	heading,
	description,
}: {
	heading: string;
	description: string;
}) => {
	return (
		<div className="border-y border-border w-full h-full p-10 md:p-14 flex flex-col items-center gap-4">
			<div className="relative inline-flex items-center justify-center px-4 py-3 z-10">
				<motion.span
					className="inline-block dark:bg-neutral-950/40 bg-white p-2 backdrop-blur-md absolute -z-10 inset-0"
					initial={{ width: 0, height: 0 }}
					whileInView={{ width: "100%", height: "100%" }}
					viewport={{ once: true }}
					transition={{ duration: 1, ease: "anticipate" }}
				>
					{/* Corner Brackets */}
					<div className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-neutral-600 dark:border-neutral-400 animate-pulse" />
					<div className="absolute top-0 right-0 size-3 border-t-2 border-r-2 border-neutral-600 dark:border-neutral-400 animate-pulse" />
					<div className="absolute bottom-0 left-0 size-3 border-b-2 border-l-2 border-neutral-600 dark:border-neutral-400 animate-pulse" />
					<div className="absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-neutral-600 dark:border-neutral-400 animate-pulse" />
				</motion.span>
				<h2 className="text-balance text-center text-3xl font-medium tracking-tighter md:text-4xl text-shadow-xs text-shadow-black/20 dark:text-shadow-white/40">
					{heading}
				</h2>
			</div>

			<p className="text-balance text-center font-medium text-muted-foreground">
				{description}
			</p>
		</div>
	);
};

export default SectionHeader;
