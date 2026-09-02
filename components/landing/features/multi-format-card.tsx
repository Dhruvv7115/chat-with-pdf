"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImagesBadge } from "@/components/ui/images-badge";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Bot, Check, GalleryVerticalEndIcon } from "lucide-react";

// Robust vector document preview cards (never fail to load)
function PdfDocumentPreview() {
	return (
		<div className="flex flex-col h-full w-full bg-white dark:bg-neutral-900 p-2 text-left font-sans select-none overflow-hidden border border-red-500/20">
			<div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-1 mb-1.5">
				<span className="rounded bg-red-500/15 text-red-600 dark:text-red-400 text-[8px] font-bold px-1 py-0.5">
					PDF
				</span>
				<span className="text-[7px] text-muted-foreground font-mono truncate max-w-16">
					Q3_Report.pdf
				</span>
			</div>
			<div className="space-y-1.5 flex-1">
				<div className="h-1.5 w-3/4 bg-neutral-300 dark:bg-neutral-700 rounded-xs" />
				<div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
				<div className="h-1 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
				<div className="h-1 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
			</div>
		</div>
	);
}

function DocxDocumentPreview() {
	return (
		<div className="flex flex-col h-full w-full bg-white dark:bg-neutral-900 p-2 text-left font-sans select-none overflow-hidden border border-blue-500/20">
			<div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-1 mb-1.5">
				<span className="rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[8px] font-bold px-1 py-0.5">
					DOCX
				</span>
				<span className="text-[7px] text-muted-foreground font-mono truncate max-w-16">
					Proposal.docx
				</span>
			</div>
			<div className="space-y-1.5 flex-1">
				<div className="h-1.5 w-2/3 bg-blue-400/40 rounded-xs" />
				<div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
				<div className="h-1 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
				<div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
			</div>
		</div>
	);
}

function MdDocumentPreview() {
	return (
		<div className="flex flex-col h-full w-full bg-white dark:bg-neutral-900 p-2 text-left font-sans select-none overflow-hidden border border-emerald-500/20">
			<div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-1 mb-1.5">
				<span className="rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold px-1 py-0.5">
					MD
				</span>
				<span className="text-[7px] text-muted-foreground font-mono truncate max-w-16">
					README.md
				</span>
			</div>
			<div className="space-y-1.5 flex-1">
				<div className="h-1.5 w-1/2 bg-emerald-400/40 rounded-xs" />
				<div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 rounded-xs flex items-center px-1">
					<div className="h-0.5 w-10 bg-emerald-500/50 rounded-xs" />
				</div>
				<div className="h-1 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
			</div>
		</div>
	);
}

export function MultiFormatCard({ className }: { className?: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: false, amount: 0.4 });
	const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);

	useEffect(() => {
		let active = true;
		const timeouts: NodeJS.Timeout[] = [];

		if (!isInView) {
			const resetTimer = setTimeout(() => {
				if (active) setStep(0);
			}, 0);
			timeouts.push(resetTimer);
			return () => {
				active = false;
				timeouts.forEach(clearTimeout);
			};
		}

		const runSequence = () => {
			if (!active) return;

			// Step 1: Left source activates and middle dashed line fills blue
			timeouts.push(
				setTimeout(() => {
					if (!active) return;
					setStep(1);
				}, 100),
			);

			// Step 2: ChatWithPDF center hub receives file & its ring progressively fills blue
			timeouts.push(
				setTimeout(() => {
					if (!active) return;
					setStep(2);
				}, 1100),
			);

			// Step 3: Dashed line from ChatWithPDF to AI progressively fills blue
			timeouts.push(
				setTimeout(() => {
					if (!active) return;
					setStep(3);
				}, 2200),
			);

			// Step 4: AI node activates & the success tick pops in
			timeouts.push(
				setTimeout(() => {
					if (!active) return;
					setStep(4);
				}, 3200),
			);

			// Reset
			timeouts.push(
				setTimeout(() => {
					if (!active) return;
					setStep(0);
				}, 4900),
			);

			// Loop sequence
			timeouts.push(
				setTimeout(() => {
					if (!active) return;
					runSequence();
				}, 5400),
			);
		};

		runSequence();

		return () => {
			active = false;
			timeouts.forEach(clearTimeout);
		};
	}, [isInView]);

	return (
		<div
			className={cn(
				"flex flex-col items-start justify-end min-h-150 md:min-h-125 p-0.5 relative group cursor-pointer max-h-100 group",
				className,
			)}
		>
			<div
				ref={containerRef}
				className="relative flex size-full items-center justify-center h-full overflow-hidden"
			>
				{/* 3-Node Architecture Pipeline */}
				<div className="relative z-10 flex items-center justify-center w-full max-w-md px-2">
					{/* 1. Left Node: Source (ImagesBadge folder with dashed ring) */}
					<div className="relative flex size-14 sm:size-16 shrink-0 items-center justify-center">
						{/* Dashed Ring */}
						<svg
							className="absolute inset-0 size-full -rotate-90"
							viewBox="0 0 100 100"
						>
							<circle
								cx="50"
								cy="50"
								r="44"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								fill="none"
								className="text-neutral-400/40 dark:text-neutral-700/50"
							/>
							<motion.circle
								cx="50"
								cy="50"
								r="44"
								stroke="#3B82F6"
								strokeWidth="1.75"
								strokeDasharray="4 4"
								fill="none"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{
									pathLength: step >= 1 ? 1 : 0,
									opacity: step >= 1 ? 1 : 0,
								}}
								transition={{ duration: 0.6, ease: "easeInOut" }}
								className="drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]"
							/>
						</svg>

						{/* Folder inside inner circle */}
						<div className="flex size-11 sm:size-12 items-center justify-center rounded-full bg-neutral-200/90 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 shadow-sm ring-4 ring-background">
							<ImagesBadge
								text=""
								images={[
									<PdfDocumentPreview key="pdf" />,
									<DocxDocumentPreview key="docx" />,
									<MdDocumentPreview key="md" />,
								]}
								folderSize={{ width: 28, height: 20 }}
								teaserImageSize={{ width: 22, height: 16 }}
								hoverImageSize={{ width: 92, height: 68 }}
								hoverTranslateY={-65}
								hoverSpread={30}
								hoverRotation={10}
							/>
						</div>
					</div>

					{/* 2. Left-to-Center Connector: 3 Parallel Dashed Lines */}
					<div className="flex-1 flex flex-col justify-center min-w-10">
						<svg
							className="w-full h-10 overflow-visible"
							viewBox="0 0 100 36"
							preserveAspectRatio="none"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<clipPath id="left-dashed-clip">
									<motion.rect
										x="0"
										y="0"
										height="36"
										initial={{ width: "0%" }}
										animate={{
											width: step >= 1 && step < 4 ? "100%" : "0%",
										}}
										transition={{ duration: 0.9, ease: "easeInOut" }}
									/>
								</clipPath>
							</defs>

							{/* Top dashed line (always dashed) */}
							<line
								x1="0"
								y1="6"
								x2="100"
								y2="6"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								className="text-neutral-400/40 dark:text-neutral-700/50"
							/>

							{/* Middle dashed line (Base muted dashed) */}
							<line
								x1="0"
								y1="18"
								x2="100"
								y2="18"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								className="text-neutral-400/40 dark:text-neutral-700/50"
							/>

							{/* Middle dashed line (Glowing blue layer clipped progressively, remaining strictly dashed) */}
							<line
								x1="0"
								y1="18"
								x2="100"
								y2="18"
								stroke="#3B82F6"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								clipPath="url(#left-dashed-clip)"
								className="drop-shadow-[0_0_6px_rgba(59,130,246,0.9)]"
							/>

							{/* Bottom dashed line (always dashed) */}
							<line
								x1="0"
								y1="30"
								x2="100"
								y2="30"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								className="text-neutral-400/40 dark:text-neutral-700/50"
							/>
						</svg>
					</div>

					{/* 3. Center Node: ChatWithPDF Primary Branded Node with Progressively Filling Dashed Ring */}
					<div className="relative flex size-18 sm:size-20 shrink-0 items-center justify-center">
						{/* Progressively Filling Dashed Outer Ring */}
						<svg
							className="absolute inset-0 size-full -rotate-90"
							viewBox="0 0 100 100"
						>
							{/* Base muted ring */}
							<rect
								x="8"
								y="8"
								width="84"
								height="84"
								rx="22"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								fill="none"
								className="text-neutral-400/40 dark:text-neutral-700/50"
							/>
							{/* Animated blue fill ring around ChatWithPDF */}
							<motion.rect
								x="8"
								y="8"
								width="84"
								height="84"
								rx="22"
								stroke="#3B82F6"
								strokeWidth="2"
								strokeDasharray="4 4"
								fill="none"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{
									pathLength: step >= 2 && step < 4 ? 1 : 0,
									opacity: step >= 2 && step < 4 ? 1 : 0,
								}}
								transition={{ duration: 0.95, ease: "easeInOut" }}
								className="drop-shadow-[0_0_8px_rgba(59,130,246,0.9)]"
							/>
						</svg>

						{/* Official ChatWithPDF Primary Branded Logo */}
						<div className="flex size-11 sm:size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 ring-4 ring-background">
							<GalleryVerticalEndIcon className="size-6 stroke-[1.75]" />
						</div>
					</div>

					{/* 4. Center-to-Right Connector: 1 Dashed Line (Progressively fills blue while remaining dashed) */}
					<div className="flex-1 flex flex-col justify-center min-w-10">
						<svg
							className="w-full h-5 overflow-visible"
							viewBox="0 0 100 20"
							preserveAspectRatio="none"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<clipPath id="right-dashed-clip">
									<motion.rect
										x="0"
										y="0"
										height="20"
										initial={{ width: "0%" }}
										animate={{
											width: step >= 3 ? "100%" : "0%",
										}}
										transition={{ duration: 0.8, ease: "easeInOut" }}
									/>
								</clipPath>
							</defs>

							{/* Base muted dashed line */}
							<line
								x1="0"
								y1="10"
								x2="100"
								y2="10"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								className="text-neutral-400/40 dark:text-neutral-700/50"
							/>

							{/* Glowing blue dashed line clipped progressively */}
							<line
								x1="0"
								y1="10"
								x2="100"
								y2="10"
								stroke="#3B82F6"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								clipPath="url(#right-dashed-clip)"
								className="drop-shadow-[0_0_6px_rgba(59,130,246,0.9)]"
							/>
						</svg>
					</div>

					{/* 5. Right Node: AI Output Node with Progressively Filling Dashed Ring & Pop-in Tick */}
					<div className="relative flex size-14 sm:size-16 shrink-0 items-center justify-center">
						{/* Dashed Ring */}
						<svg
							className="absolute inset-0 size-full -rotate-90"
							viewBox="0 0 100 100"
						>
							<circle
								cx="50"
								cy="50"
								r="44"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeDasharray="4 4"
								fill="none"
								className="text-neutral-400/40 dark:text-neutral-700/50"
							/>
							<motion.circle
								cx="50"
								cy="50"
								r="44"
								stroke="#3B82F6"
								strokeWidth="1.75"
								strokeDasharray="4 4"
								fill="none"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{
									pathLength: step >= 4 ? 1 : 0,
									opacity: step >= 4 ? 1 : 0,
								}}
								transition={{ duration: 0.6, ease: "easeInOut" }}
								className="drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]"
							/>
						</svg>

						{/* AI Bot Center */}
						<div className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-neutral-200/90 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 shadow-sm ring-4 ring-background">
							<Bot className="size-5 stroke-[1.75]" />
						</div>

						{/* Success Tick Badge - Appears at last step */}
						<AnimatePresence>
							{step === 4 && (
								<motion.div
									initial={{ scale: 0, opacity: 0, rotate: -20 }}
									animate={{ scale: 1, opacity: 1, rotate: 0 }}
									exit={{ scale: 0, opacity: 0 }}
									transition={{ type: "spring", stiffness: 500, damping: 22 }}
									title="Verified format support"
									className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-background z-20"
								>
									<Check className="size-3 stroke-3" />
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>

			{/* Text at Bottom */}
			<div className="flex-1 flex-col gap-2 p-6">
				<h3 className="text-lg tracking-tighter font-semibold">
					Multi-format support
				</h3>
				<p className="text-muted-foreground">
					PDF, DOCX, MD, and TXT in one unified chat interface. Ingest, parse,
					and analyze any file type in seconds.
				</p>
			</div>
		</div>
	);
}

export default MultiFormatCard;
