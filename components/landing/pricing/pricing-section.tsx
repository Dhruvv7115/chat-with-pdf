"use client";
import { cn } from "@/lib/utils";
import SectionHeader from "../section-header";
import PricingCards from "@/components/billings/pricing-cards";
import { useRouter } from "next/navigation";

const PricingSection = () => {
	const router = useRouter();

	return (
		<section
			id="pricing"
			className={cn(
				"relative scroll-mt-24 w-full overflow-hidden bg-background text-accent-foreground",
			)}
		>
			<SectionHeader
				heading="Simple, Transparent Pricing"
				description="Choose the plan that fits your needs. All plans include a 7-day free trial."
			/>
			<div className="px-6 relative">
				<PricingCards handleCheckout={() => router.push("/login")} />
			</div>
		</section>
	);
};

export default PricingSection;
