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
		<div className="flex items-center justify-start w-full px-4">
			<div className="flex items-center  gap-3">
				<div className="relative flex h-3 w-3">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-75" />
					<span className="relative inline-flex rounded-full h-3 w-3 bg-lime-600" />
				</div>
				<span className="text-base font-medium text-neutral-600 dark:text-neutral-300 transition-opacity duration-300">
					<div>
						<motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
							<LayoutTextFlip words={THINKING_WORDS} />
						</motion.div>
					</div>
				</span>
			</div>
		</div>
	);
};

export default ThinkingIndicator;
