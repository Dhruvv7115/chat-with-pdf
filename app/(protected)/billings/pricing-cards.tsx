import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/plans";
const commonDotStyles =
	"absolute w-1 h-1 rounded-full bg-neutral-600 dark:bg-neutral-400 animate-pulse";
export default function PricingCards({
	loading,
	setLoading,
}: {
	loading: boolean;
	setLoading: (l: boolean) => void;
}) {
	const handleCheckout = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/checkout_sessions", { method: "POST" });
			const { url } = await res.json();
			window.location.href = url; // ← redirect here
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
			<span className={cn("-top-0.5 -left-0.5", commonDotStyles)}></span>
			<span className={cn("-top-0.5 -right-0.5", commonDotStyles)}></span>
			<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)}></span>
			<span className={cn("-bottom-0.5 -right-0.5", commonDotStyles)}></span>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 mx-auto max-w-7xl">
				{PLANS.map((plan) => {
					return (
						<Card
							key={plan.name}
							className={cn(
								"flex flex-col h-full rounded-3xl p-2",
								plan.current && "bg-neutral-800 dark:bg-neutral-300",
							)}
						>
							<CardHeader
								className={cn(
									"px-8 py-12 md:px-8 md:py-12 rounded-xl",
									plan.current
										? "bg-black dark:bg-neutral-100"
										: "bg-muted dark:bg-neutral-800",
								)}
							>
								<div className="flex items-center justify-between gap-2">
									<CardTitle
										className={cn(
											"text-base md:text-2xl  font-bold",
											plan.current && "text-white dark:text-neutral-900",
										)}
									>
										{plan.name}
									</CardTitle>
									{plan.current && (
										<Badge
											className={cn(
												"w-fit text-xs mb-2",
												"text-neutral-200 dark:text-neutral-800",
											)}
										>
											Current plan
										</Badge>
									)}
								</div>
								<CardDescription
									className={cn(
										"text-sm lg:text-base max-w-xs",
										plan.current && "text-neutral-200 dark:text-neutral-500",
									)}
								>
									{plan.description}
								</CardDescription>
							</CardHeader>
							<CardContent
								className={cn(
									"mt-2 p-8 md:mt-8 relative border-neutral-200",
									plan.current && "border-neutral-600 dark:border-neutral-800",
								)}
							>
								<div className="flex items-baseline-last gap-2">
									<span
										className={cn(
											"text-2xl font-medium tracking-tight md:text-4xl lg:text-6xl dark:text-neutral-200",
											plan.current && "text-white dark:text-black",
										)}
									>
										{plan.price}
									</span>
									<span
										className={cn(
											"text-sm text-neutral-500 dark:text-neutral-500",
											plan.current && "text-white",
										)}
									>
										/
									</span>
									<span
										className={cn(
											"text-sm text-neutral-500 dark:text-neutral-500",
											plan.current && "text-white",
										)}
									>
										{plan.period}
									</span>
								</div>
								<button
									className={cn(
										"mt-4 w-full cursor-pointer rounded-full px-4 py-4 text-base font-medium transition-all duration-200 active:scale-98 md:mt-6 text-white",
										plan.current
											? "bg-black"
											: "bg-linear-to-t from-lime-600 to-lime-500 shadow-[0px_0.5px_2px_0px_var(--color-lime-300)_inset]",
									)}
									disabled={plan.current}
									onClick={handleCheckout}
								>
									{plan.current
										? "Current plan"
										: loading
											? `Switch to ${plan.name}...`
											: `Switch to ${plan.name}`}
								</button>
								<div
									className={cn(
										"absolute bottom-0 left-1/2 -translate-x-1/2 w-5/6 border-b border-dashed",
										plan.current ? "border-neutral-600" : "border-neutral-300",
									)}
								></div>
							</CardContent>
							<CardContent className="flex flex-col w-full md:px-8 mt-8 items-start mb-4">
								<p
									className={cn(
										"font-mono uppercase text-sm tracking-tight",
										plan.current
											? "text-neutral-400 dark:text-neutral-500"
											: "text-neutral-600 dark:text-neutral-400",
									)}
								>
									{plan.name} PLAN INCLUDES
								</p>
								<ul className="flex flex-col gap-6 my-4">
									{plan.features.map((f) => (
										<li
											key={f}
											className={cn(
												"flex items-start justify-start gap-2",
												plan.current
													? "text-neutral-300 dark:text-neutral-800"
													: " text-neutral-700 dark:text-neutral-300",
											)}
										>
											<div className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full p-0", plan.current ? "bg-neutral-700 dark:bg-neutral-200": "bg-neutral-200 dark:bg-neutral-700")}>
												<Check className="size-2 stroke-[4px]" />
											</div>
											{f}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
