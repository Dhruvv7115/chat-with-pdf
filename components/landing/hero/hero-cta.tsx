"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const HeroCta = () => {
	return (
		<div className="flex items-center gap-2">
			<Link href="#">
				<button
					className={cn(
						"dark:bg-neutral-900 hover:bg-black/90 bg-neutral-900/80",
						"text-sm font-semibold text-white",
						"border border-transparent",
						"rounded-full px-6 py-3",
						"shadow-[inset_0px_1px_0px_0px_#FFFFFF40,inset_0px_-1px_0px_0px_#FFFFFF40]",
            "active:scale-95 cursor-pointer",
						"flex items-center justify-center",
            "transition duration-200 ease-in-out",
						"relative z-10",
					)}
				>
					How it works? 
				</button>
			</Link>
			<Link href="/signup">
				<button
					className={cn(
						"hover:bg-lime-700 bg-lime-600",
						"text-sm font-semibold text-white",
						"rounded-full px-6 py-3",
            "active:scale-95 cursor-pointer",
						"shadow-[inset_0px_0px_10px_0px_rgba(0,0,0,0.4)]",
						"transition-all duration-200 ease-in-out",
					)}
				>
					<span className="flex items-center gap-2">
						Get Started
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
