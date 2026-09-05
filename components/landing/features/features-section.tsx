"use client";

import MultiFormatCard from "./multi-format-card";
import PageCitationsCard from "./page-citations-card";
import StreamingResponsesCard from "./streaming-responses-card";
import { PersonalisationCard } from "./personalisation-card";
import SectionHeader from "../section-header";

export function FeaturesSection() {
	return (
		<section
			id="features"
			className="relative scroll-mt-24 w-full overflow-hidden border-t bg-background text-accent-foreground [--pattern-fg:var(--color-black)]/10 dark:bg-background dark:[--pattern-fg:var(--color-white)]/10 flex flex-col items-center justify-center px-3 md:px-10"
		>
			<div className="border-x mx-5 md:mx-10 relative">
				<div className="absolute top-0 -left-4 md:-left-14 h-full w-4 md:w-14 text-primary/5 bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px]" />
				<div className="absolute top-0 -right-4 md:-right-14 h-full w-4 md:w-14 text-primary/5 bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px]" />
				{/* Section Header with Corner Bracket Accents & Images Badge */}
				<SectionHeader
					heading="Everything you need, nothing you don't"
					description="Every answer points back to the page it came from. Everything else just gets out of your way."
				/>

				<div className="relative">
					<div className="mx-auto max-w-7xl">
						<div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
							{/* Row 1, Left: Multi-format support */}
							<MultiFormatCard />

							{/* Row 1, Right: Page-cited answers */}
							<PageCitationsCard />

							{/* Row 2, Left: Streaming responses */}
							<StreamingResponsesCard />

							{/* Row 2, Right: Custom AI personalization */}
							<PersonalisationCard />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default FeaturesSection;
