"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Bot, Check, Sparkles, SlidersHorizontal, Quote } from "lucide-react";

type ResponseStyle = "concise" | "detailed";

const PERSONAS = [
	{
		id: "analyst",
		label: "Senior Analyst",
		prompt:
			"Adopt a quantitative persona. Focus on key metrics, margins, and direct facts.",
		conciseAnswer:
			"Q3 revenue rose 12% QoQ to €8.4M. Operating margin expanded to 18.2%, driven by 24% enterprise renewals in DACH.",
		detailedAnswer:
			"• Revenue: €8.4M (+12% QoQ, beat consensus by 4.2%).\n• Margins: Operating margin expanded 240 bps to 18.2% via cloud optimization.\n• Drivers: Enterprise renewals grew 24% across DACH & Nordics.",
	},
	{
		id: "professor",
		label: "Research Professor",
		prompt:
			"Explain findings methodically with academic rigor, context, and clear takeaways.",
		conciseAnswer:
			"The findings demonstrate significant operating leverage, with top-line growth (+12%) outpacing operational expenditure.",
		detailedAnswer:
			"1. Hypothesis Verification: Regional expansion confirms sustained market penetration.\n2. Methodological Rigor: Financial metrics demonstrate scalable unit economics with reduced overhead.\n3. Conclusion: Recommends further capital allocation to primary European hubs.",
	},
];

export function PersonalisationCard({ className }: { className?: string }) {
	const [style, setStyle] = useState<ResponseStyle>("concise");
	const [personaIndex, setPersonaIndex] = useState(0);

	const activePersona = PERSONAS[personaIndex];
	const currentAnswer =
		style === "concise"
			? activePersona.conciseAnswer
			: activePersona.detailedAnswer;

	return (
		<div
			className={cn(
				"flex flex-col items-start justify-end min-h-150 md:min-h-125 p-0.5 relative group cursor-pointer max-h-100 group",
				className,
			)}
		>
			{/* Top Graphic: Interactive Personalization Studio Mockup */}
			<div className="w-full h-full p-4 flex flex-col items-center justify-center gap-5 relative">
				{/* Background subtle radial glow */}
				<div className="pointer-events-none absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent opacity-40" />

				<div className="relative z-10 flex w-full max-w-md flex-col gap-3 rounded-2xl border border-border/80 bg-background/95 p-3.5 sm:p-4 shadow-xl backdrop-blur-xl transition-all">
					{/* Controls Header: Response Style Segment & Persona Switcher */}
					<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
						<div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
							<SlidersHorizontal className="size-3.5 text-primary" />
							<span>Response Style</span>
						</div>

						{/* Style Toggle Segment: Concise vs Detailed */}
						<div className="flex items-center rounded-lg bg-muted/70 p-0.5 text-[10px] font-medium border border-border/50">
							<button
								type="button"
								onClick={() => setStyle("concise")}
								className={cn(
									"relative rounded-md px-2.5 py-1 transition-all cursor-pointer",
									style === "concise"
										? "bg-background text-foreground shadow-xs font-semibold"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{style === "concise" && (
									<motion.div
										layoutId="style-active-pill"
										className="absolute inset-0 rounded-md bg-background shadow-xs -z-10"
										transition={{ type: "spring", stiffness: 450, damping: 30 }}
									/>
								)}
								Concise
							</button>

							<button
								type="button"
								onClick={() => setStyle("detailed")}
								className={cn(
									"relative rounded-md px-2.5 py-1 transition-all cursor-pointer",
									style === "detailed"
										? "bg-background text-foreground shadow-xs font-semibold"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{style === "detailed" && (
									<motion.div
										layoutId="style-active-pill"
										className="absolute inset-0 rounded-md bg-background shadow-xs -z-10"
										transition={{ type: "spring", stiffness: 450, damping: 30 }}
									/>
								)}
								Detailed
							</button>
						</div>
					</div>

					{/* Custom Persona Prompt Field */}
					<div className="rounded-xl border border-border/70 bg-muted/30 p-2.5 transition-colors">
						<div className="flex items-center justify-between mb-1.5">
							<div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
								<Sparkles className="size-3 text-primary" />
								<span>Custom Persona Prompt</span>
							</div>

							{/* Persona Switcher Chips */}
							<div className="flex items-center gap-1">
								{PERSONAS.map((p, idx) => (
									<button
										key={p.id}
										type="button"
										onClick={() => setPersonaIndex(idx)}
										className={cn(
											"text-[9px] px-2 py-0.5 rounded-full border transition-all cursor-pointer",
											personaIndex === idx
												? "border-primary/40 bg-primary/10 text-primary font-semibold shadow-2xs"
												: "border-border/60 bg-background/60 text-muted-foreground hover:text-foreground",
										)}
									>
										{p.label}
									</button>
								))}
							</div>
						</div>

						{/* Prompt Box */}
						<div className="flex items-start gap-1.5 text-[11px] text-foreground/90 font-mono leading-relaxed bg-background/80 rounded-lg p-2 border border-border/50">
							<Quote className="size-3 text-primary shrink-0 mt-0.5 rotate-180 opacity-70" />
							<p className="line-clamp-2 text-[10px] sm:text-[11px]">
								{activePersona.prompt}
							</p>
						</div>
					</div>

					{/* Live AI Response Output Preview */}
					<div className="rounded-xl border border-primary/25 bg-primary/5 p-2.5 sm:p-3 text-[11px] leading-relaxed">
						<div className="flex items-center justify-between mb-1.5">
							<div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary">
								<div className="flex size-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
									<Bot className="size-2.5" />
								</div>
								<span>AI Response Preview</span>
							</div>

							<span className="text-[9px] font-medium text-muted-foreground flex items-center gap-1">
								<Check className="size-2.5 text-emerald-500" />
								{style === "concise" ? "Concise summary" : "In-depth breakdown"}
							</span>
						</div>

						{/* Dynamic Animated Response Text */}
						<AnimatePresence mode="wait">
							<motion.p
								key={`${style}-${personaIndex}`}
								initial={{ opacity: 0, y: 3 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -3 }}
								transition={{ duration: 0.2 }}
								className="text-foreground text-[10px] sm:text-[11px] whitespace-pre-line leading-relaxed font-sans"
							>
								{currentAnswer}
							</motion.p>
						</AnimatePresence>
					</div>
				</div>
			</div>

			{/* Text at Bottom */}
			<div className="flex-1 flex-col gap-2 p-6">
				<h3 className="text-lg tracking-tighter font-semibold">
					Custom AI personalization
				</h3>
				<p className="text-muted-foreground">
					Adjust answer depth from quick summaries to deep dives, with custom personas tailored to your workflow.
				</p>
			</div>
		</div>
	);
}

export default PersonalisationCard;
