"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const HeroCta = () => {
	return (
		<div className="flex items-center w-full justify-center gap-2 sm:px-0 px-4">
			<Link href="/login">
				<button
					className={cn(
						"hover:bg-black/80 bg-neutral-900",
						"text-sm font-normal tracking-wide",
						"text-primary-foreground dark:text-secondary-foreground",
						"h-9 w-32",
						"rounded-full px-5",
						"shadow-[inset_0px_1px_0px_0px_#FFFFFF40,inset_0px_-1px_0px_0px_#FFFFFF40] dark:shadow-[inset_0px_1px_0px_0px_#FFFFFF40,inset_0px_-1px_0px_0px_#FFFFFF40]",
						"flex items-center justify-center",
						"transition-all ease-in-out duration-200 active:scale-95 cursor-pointer",
					)}
				>
					Log in
				</button>
			</Link>
			<Link href="/signup">
				<button
					className={cn(
						"flex items-center justify-center",
						"text-sm font-normal tracking-wide",
						"text-primary-foreground dark:text-secondary-foreground",
						"h-9 w-fit",
						"shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)]",
						"rounded-full px-4",
						"bg-primary hover:bg-primary/80",
						"transition-all ease-out duration-200 active:scale-95 cursor-pointer"
					)}
				>
					<span className="flex items-center gap-2">
						Try for free
						<ArrowRight
							strokeWidth={2.5}
							className="ml-1 size-4 animate-[bounceX_1.5s_infinite]"
						/>
					</span>
				</button>
			</Link>
		</div>
	);
};

export default HeroCta;


