import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { LayoutTextFlip } from "./ui/layout-text-flip";

const THINKING_WORDS = [
	"Thinking",
	"Reading",
	"Analyzing",
	"Understanding",
	"Processing",
	"Almost there",
];

const ThinkingIndicator = () => {
	const [wordIndex, setWordIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setWordIndex((i) => (i + 1) % THINKING_WORDS.length);
		}, 1800);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex items-center justify-start w-full px-4 my-2">
			<div className="flex items-center justify-center gap-2 md:gap-3">
				<div className="relative flex md:h-3.5 md:w-3.5 w-2.5 h-2.5">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-600 opacity-75" />
					<span className="relative inline-flex rounded-full md:h-3.5 md:w-3.5 w-2.5 h-2.5 bg-lime-600" />
				</div>
				<span className="text-base font-medium text-neutral-600 dark:text-neutral-300 transition-opacity duration-300 flex items-start justify-start">
					<motion.div className="relative flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
						<LayoutTextFlip words={THINKING_WORDS} />
					</motion.div>
				</span>
			</div>
		</div>
	);
};

export default ThinkingIndicator;
