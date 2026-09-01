import { Testimonial } from "@/constants/testimonials";

export default function TestimonialCard({ item }: { item: Testimonial }) {
	return (
		<div className="rounded-2xl border border-white/8 bg-neutral-200/50 dark:bg-neutral-800/60 p-6 backdrop-blur-sm transition-colors hover:border-white/20 h-50 flex items-stretch justify-between flex-col max-w-full">
			<p className="text-sm leading-relaxed text-accent-foreground/80">
				{item.text}
				<span className="font-medium text-lime-600">{item.highlight}</span>
			</p>

			<div className="mt-5 flex items-stretch justify-start gap-2">
				<img
					src={item.avatar}
					alt={item.name}
					className="h-10 w-10 rounded-full border border-white/10 object-cover"
				/>

				<div>
					<h4 className="text-sm font-semibold text-accent-foreground/60">
						{item.name}
					</h4>

					<p className="text-xs text-accent-foreground/60">{item.role}</p>
				</div>
			</div>
		</div>
	);
}
