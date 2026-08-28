"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/client";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Zap, Sparkles, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { IconBookFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const MonthlyUsage = () => {
	const { data: quota, isLoading } = api.pdf.getUploadQuota.useQuery();
	const router = useRouter();
	const isPro = quota?.pro ?? false;
	const uploaded = quota?.uploaded ?? 0;
	const limit = quota?.limit ?? 5;
	const percentage = isPro
		? 100
		: limit > 0
			? Math.min(Math.round((uploaded / limit) * 100), 100)
			: 0;

	if (isLoading) {
		return (
			<div className="mx-2 p-3.5 rounded-2xl border border-border/50 bg-sidebar-accent/30 space-y-2.5">
				<div className="flex justify-between items-center">
					<Skeleton className="h-3 w-20" />
					<Skeleton className="h-3 w-12" />
				</div>
				<div className="flex justify-between items-center">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-8" />
				</div>
				<Skeleton className="h-1.5 w-full rounded-full" />
			</div>
		);
	}

	return (
		<div className="mx-2">
			<div className="w-full rounded-2xl bg-sidebar-accent/40 dark:bg-neutral-900/60 border border-border/70 dark:border-neutral-800/80 p-3.5 transition-all shadow-2xs hover:border-border hover:shadow-xs">
				{/* Top Header Row */}
				<div className="flex items-center justify-between gap-2 mb-2.5">
					<span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase select-none">
						MONTHLY USAGE
					</span>

					{isPro ? (
						<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-lime-500/15 text-lime-600 dark:text-lime-400 border border-lime-500/30">
							<Zap className="size-2.5 fill-current" />
							PRO
						</span>
					) : (
						<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
							<IconBookFilled className="size-2.5 fill-current" />
							HOBBY
						</span>
					)}
				</div>

				{/* Bottom Usage Row */}
				<div className="flex items-baseline justify-between text-sm">
					<div className="flex items-baseline gap-1">
						<span className="font-bold text-foreground text-sm">
							{uploaded}
						</span>
						<span className="text-xs text-muted-foreground font-normal">
							/ {isPro ? "∞" : `${limit} ${limit === 1 ? "doc" : "docs"}`}
						</span>
					</div>

					<span className="text-xs font-bold text-foreground">
						{isPro ? "100%" : `${percentage}%`}
					</span>
				</div>

				{/* Sleek Progress Bar */}
				<div className="my-2.5 h-1.5 w-full bg-neutral-200/80 dark:bg-neutral-800/90 rounded-full overflow-hidden">
					<div
						className={cn(
							"h-full rounded-full transition-all duration-500",
							isPro
								? "bg-linear-to-r from-lime-500 to-emerald-500"
								: percentage >= 100
									? "bg-red-500"
									: percentage >= 80
										? "bg-amber-500"
										: "bg-primary",
						)}
						style={{ width: `${Math.min(percentage, 100)}%` }}
					/>
				</div>
				{!isPro && (
					<button
						type="button"
						className="flex cursor-pointer bg-neutral-900 px-4 py-3 font-medium text-white shadow-[inset_0px_0px_10px_0px_rgba(255,255,255,0.2)] transition-all duration-200 active:scale-98 dark:bg-white dark:text-black w-full items-center justify-center rounded-full text-center text-sm hover:shadow-none sm:w-full group"
						onClick={() => router.push("/billings")}
					>
						Upgrade
						<ArrowUpRight className="size-4 ml-1 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</button>
				)}
			</div>
		</div>
	);
};

export default MonthlyUsage;
