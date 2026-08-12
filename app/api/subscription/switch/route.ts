import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { client } from "@/lib/prisma";

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}
  const plans = ["HOBBY", "PRO"];

	const { targetPlan } = await req.json(); // "HOBBY" | "PRO"
	if (!targetPlan || !plans.includes(targetPlan)) {
		return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
	}

	const userId = session.user.id;

	const subscription = await client.subscription.findUnique({
		where: { userId },
	});

	if (!subscription) {
		return NextResponse.json(
			{ error: "No subscription record found" },
			{ status: 404 },
		);
	}

	// Downgrade to Hobby — cancel at period end, keep access till they've paid through
	if (targetPlan === "HOBBY") {
		if (!subscription.stripeSubscriptionId) {
			return NextResponse.json({ error: "Already on Hobby" }, { status: 400 });
		}

		await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
			cancel_at_period_end: true,
		});

		await client.subscription.update({
			where: { userId },
			data: { cancelAtPeriodEnd: true },
		});

		return NextResponse.json({
			message:
				"Subscription will downgrade to Hobby at the end of the billing period",
		});
	}

	// Upgrade to Pro
	if (subscription.plan === "PRO" && !subscription.cancelAtPeriodEnd) {
		return NextResponse.json({ error: "Already on Pro" }, { status: 400 });
	}

	// Re-subscribing after a scheduled cancellation — just undo the cancellation, no new charge
	if (subscription.stripeSubscriptionId && subscription.cancelAtPeriodEnd) {
		await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
			cancel_at_period_end: false,
		});

		await client.subscription.update({
			where: { userId },
			data: { cancelAtPeriodEnd: false },
		});

		return NextResponse.json({
			message: "Cancellation reversed, staying on Pro",
		});
	}

	// True new subscription — needs Checkout Session
	const checkoutSession = await stripe.checkout.sessions.create({
		mode: "subscription",
		payment_method_types: ["card"],
		line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
		client_reference_id: userId,
		success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
		cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?canceled=true`,
	});

	return NextResponse.json({ url: checkoutSession.url });
}
