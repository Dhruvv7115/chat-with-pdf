"use client";

import { Testimonial } from "@/constants/testimonials";
import TestimonialCard from "./testimonial-card";
import { cn } from "@/lib/utils";

interface MarqueeColumnProps {
	items: Testimonial[];
	speed?: number;
	direction?: "up" | "down" | "left" | "right";
	pauseOnHover?: boolean;
}

export function MarqueeColumn({
	items,
	speed = 30,
	direction = "up",
}: MarqueeColumnProps) {
	const duration = `${speed}s`;
	return (
		<div className="group relative h-full overflow-hidden w-fit mx-auto px-4">
			<div
				className={cn(
					"flex flex-col gap-4",
					direction === "up" ? "animate-marquee-up" : "animate-marquee-down",
				)}
				style={{ animationDuration: duration }}
			>
				{[...items, ...items].map((item, idx) => (
					<TestimonialCard
						key={idx}
						item={item}
					/>
				))}
			</div>
		</div>
	);
}
