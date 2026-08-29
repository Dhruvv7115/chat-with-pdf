import { ComponentExample } from "@/components/component-example";
import { CyclingFileType } from "@/components/landing/cycling-file-types";
import HeroCta from "@/components/landing/hero/hero-cta";
import { HeroHeading } from "@/components/landing/hero/hero-heading";
import HeroSubheading from "@/components/landing/hero/hero-subheading";
import { DummyContent, NavbarDemo } from "@/components/landing/navbar";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
export default async function Page() {
	const session = await getServerSession();
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-rose-100 to-lime-100 dark:from-olive-950 dark:to-olive-700 relative">
			{/* Top Ambient Glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 h-72 w-150 rounded-full bg-lime-500/10 blur-[100px]"
			/>
			<NavbarDemo />
			<main className="flex flex-col items-center justify-center gap-2 mt-48 z-10">
				<HeroHeading />

				<HeroSubheading />

				<HeroCta />
			</main>
			<section>
				<ComponentExample />
			</section>
		</div>
	);
}
