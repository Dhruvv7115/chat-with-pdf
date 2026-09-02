"use client";

import { testimonials } from "@/constants/testimonials";
import { MarqueeColumn } from "./testimonial-column";
import SectionHeader from "../section-header";

export default function TestimonialsSection() {
	const col1 = testimonials.slice(0, 3);
	const col2 = [testimonials[2], testimonials[4], testimonials[0]];
	const col3 = testimonials.slice(3, 6);

	return (
		<section
			id="testimonials"
			className="relative w-full overflow-hidden border-t bg-background pt-24 text-accent-foreground"
		>
			{/* Header */}
			<SectionHeader
				heading="Loved by researchers, students, and analysts"
				description="See how early users parse dense documents and cut reading time in half."
			/>
			{/* Marquee Viewport */}
			<div className="relative mt-16 border-y px-6 md:px-16">
				{/* 3-Column Grid */}
				<div className="grid h-160 grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-3 mask-[linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]">
					<MarqueeColumn
						items={col1}
						speed={28}
						direction="down"
					/>
					<div className="hidden md:block h-full">
						<MarqueeColumn
							items={col2}
							speed={34}
							direction="up"
						/>
					</div>
					<div className="hidden lg:block h-full">
						<MarqueeColumn
							items={col3}
							speed={30}
							direction="down"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
