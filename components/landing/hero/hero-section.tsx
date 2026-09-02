"use client";
import { HeroHeading } from "./hero-heading";
import HeroSubheading from "./hero-subheading";
import HeroCta from "./hero-cta";
import { IconBoltFilled } from "@tabler/icons-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

const HeroSection = () => {
	return (
		<section
			id="hero"
			className="w-full relative"
		>
			<div className="relative flex flex-col items-center w-full px-6">
				<div className="absolute inset-0">
					<div className="absolute inset-0 -z-10 h-150 md:h-200 w-full [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--primary)_100%)] rounded-b-3xl" />
				</div>
				<div className="relative z-10 pt-32 max-w-3xl mx-auto h-full w-full flex flex-col gap-10 items-center justify-center">
					<p className="border border-muted bg-muted rounded-full text-sm h-8 px-3 flex items-center gap-2">
						<IconBoltFilled
							width={16}
							height={16}
						/>
						Instant Citation & Summaries
					</p>
					<div className="flex flex-col items-center justify-center gap-5">
						<HeroHeading />
						<HeroSubheading />
					</div>
					<HeroCta />
				</div>
			</div>
			<div className="relative px-6 mt-10">
				<HeroVideoDialog
					animationStyle="from-center"
					videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
					thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
					thumbnailAlt="Hero Video"
				/>
			</div>
		</section>
	);
};

export default HeroSection;
