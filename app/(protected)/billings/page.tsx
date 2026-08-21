"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PricingCards from "@/components/billings/pricing-cards";
import CurrentPlanSummary from "@/components/billings/current-plan";
import InvoiceHistory from "@/components/billings/invoice-history";

export default function BillingPage() {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const handleCheckout = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/checkout_sessions", { method: "POST" });
			const { url } = await res.json();
			return redirect(url);
		} finally {
			setLoading(false);
			return;
		}
	};
	useEffect(() => {
		if (searchParams.get("success")) {
			toast.success("You're now on the Pro plan!");
		}
		if (searchParams.get("canceled")) {
			toast.error("Payment canceled.");
		}
	}, [searchParams]);

	return (
		<div className="bg-sidebar">
			<div className="mx-auto px-6 py-6 space-y-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-accent-foreground">
						Billings
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your plan and payment details
					</p>
				</div>

				{/* Current plan summary */}
				<CurrentPlanSummary />

				{/* Plans */}
				<PricingCards
					loading={loading}
					setLoading={setLoading}
					handleCheckout={handleCheckout}
				/>

				{/* Invoice history */}
				<InvoiceHistory />
			</div>
		</div>
	);
}
