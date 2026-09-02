"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Bot } from "lucide-react";
import Image from "next/image";
const QUESTION =
	"What was the financial breakdown for the European division in Q3?";

const ANSWER =
	"The European division reported €8.4M in net revenue (up 12% quarter-over-quarter).\n\n" +
	"Operating Margin: Reached 18.2% with lower cloud overhead.\n" +
	"Growth Drivers: Enterprise renewals grew 24%, driven by DACH and Nordics.";
export function StreamingResponsesCard({ className }: { className?: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.6 });
	const [phase, setPhase] = useState<
		"idle" | "question" | "streaming" | "done"
	>("idle");
	const [streamedText, setStreamedText] = useState("");

	useEffect(() => {
		if (!isInView) {
			setPhase("idle");
			setStreamedText("");
			return;
		}

		const questionTimer = setTimeout(() => setPhase("question"), 300);
		const streamStartTimer = setTimeout(() => setPhase("streaming"), 1200);

		return () => {
			clearTimeout(questionTimer);
			clearTimeout(streamStartTimer);
		};
	}, [isInView]);
	useEffect(() => {
		if (phase !== "streaming") return;

		let i = 0;
		const interval = setInterval(() => {
			i += 1;
			setStreamedText(ANSWER.slice(0, i));
			if (i >= ANSWER.length) {
				clearInterval(interval);
				setPhase("done");
			}
		}, 18);

		return () => clearInterval(interval);
	}, [phase]);
	return (
		<div
			className={cn(
				"flex flex-col items-start justify-end min-h-150 md:min-h-125 p-0.5 relative group cursor-pointer max-h-100 group",
				className,
			)}
		>
			{/* Top Graphic: Glowing Planet / Atmospheric Horizon Arc with Stream Stats */}
			<div
				ref={containerRef}
				className="relative flex size-full items-center justify-center overflow-hidden mask-[linear-gradient(to_bottom,var(--background)_70%,transparent_100%)] px-4"
			>
				{/* <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-linear-to-t from-background to-transparent z-20" /> */}

				<div className="w-full max-w-md mx-auto flex flex-col gap-3">
					{/* User question bubble */}
					<AnimatePresence>
						{phase !== "idle" && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="flex items-end justify-end gap-2"
							>
								<div className="md:max-w-72 max-w-60 bg-lime-700 dark:bg-lime-600 text-white p-3 rounded-2xl text-sm shadow-sm">
									{QUESTION}
								</div>
								<div className="flex items-center justify-center shrink-0">
									<Image
										src="https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
										alt="user"
										width={36}
										height={36}
										className="rounded-full"
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* AI response bubble */}
					<AnimatePresence>
						{(phase === "streaming" || phase === "done") && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="flex items-start gap-2"
							>
								<div className="flex items-center justify-center bg-primary rounded-full p-2 shrink-0">
									<Bot className="size-5 text-neutral-100 dark:text-neutral-800" />
								</div>

								<div className="md:max-w-72 max-w-65 p-3.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm">
									<p className="text-sm text-neutral-800 dark:text-neutral-100">
										{streamedText}
										{phase === "streaming" && (
											<span className="inline-block w-1 h-3.5 ml-0.5 -mb-0.5 bg-lime-700 dark:bg-lime-400 animate-pulse" />
										)}
										{phase === "done" && (
											<motion.span
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 0.2 }}
												className="inline ml-1.5 text-xs font-medium text-lime-700 dark:text-lime-400"
											>
												Page 14
											</motion.span>
										)}
									</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
			{/* Text at Bottom */}
			<div className="flex-1 flex-col gap-2 p-6">
				<h3 className="text-lg tracking-tighter font-semibold">
					Streaming responses
				</h3>
				<p className="text-muted-foreground">
					Answers appear in real-time as they're generated, not after a wait.
					Ultra-low latency powered by Gemini AI.
				</p>
			</div>
		</div>
	);
}

export default StreamingResponsesCard;
