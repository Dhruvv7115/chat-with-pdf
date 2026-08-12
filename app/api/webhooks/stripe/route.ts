import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "@/lib/prisma"; // adjust to your actual prisma client import

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
	const body = await req.text(); // must be raw text, not parsed JSON
	const signature = req.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json(
			{ error: "Missing stripe-signature header" },
			{ status: 400 },
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		console.error("Webhook signature verification failed:", err);
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				await fulfillCheckout(event.data.object as Stripe.Checkout.Session);
				break;
			}

			case "invoice.payment_succeeded": {
				await handleInvoicePaid(event.data.object as Stripe.Invoice);
				break;
			}

			case "customer.subscription.deleted": {
				await handleSubscriptionDeleted(
					event.data.object as Stripe.Subscription,
				);
				break;
			}

			case "customer.subscription.updated": {
				await handleSubscriptionUpdated(
					event.data.object as Stripe.Subscription,
				);
				break;
			}

			default: {
				// Event type we don't act on — acknowledge and move on
				console.log("Unhandled event type:", event.type);
			}
		}

		return NextResponse.json({ received: true }, { status: 200 });
	} catch (err) {
		console.error("Error handling webhook event:", err);
		// Return 500 so Stripe retries the event
		return NextResponse.json(
			{ error: "Webhook handler failed" },
			{ status: 500 },
		);
	}
}

// --- Handlers ---

async function fulfillCheckout(session: Stripe.Checkout.Session) {
	console.log("Fulfilling Checkout Session " + session.id);

	const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
		expand: ["line_items"],
	});

	if (checkoutSession.payment_status !== "paid") {
		console.log("Checkout session not paid, skipping fulfillment");
		return;
	}

	const userId = session.client_reference_id;
	if (!userId) {
		throw new Error("Missing client_reference_id (userId) on checkout session");
	}

	const stripeSubscriptionId = checkoutSession.subscription as string;
	if (!stripeSubscriptionId) {
		throw new Error("No subscription found on checkout session " + session.id);
	}

	// Idempotency check — has this Stripe subscription already been recorded?
	const existing = await client.subscription.findUnique({
		where: { stripeSubscriptionId },
	});
	if (existing) {
		console.log(
			"Already fulfilled for stripeSubscriptionId",
			stripeSubscriptionId,
		);
		return;
	}

	const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
	const item = stripeSub.items.data[0];

	await client.subscription.update({
		where: { userId },
		data: {
			plan: "PRO",
			status: "ACTIVE",
			stripeCustomerId: stripeSub.customer as string,
			stripeSubscriptionId: stripeSub.id,
			currentPeriodStart: new Date(item.current_period_start * 1000),
			currentPeriodEnd: new Date(item.current_period_end * 1000),
			cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
		},
	});

	console.log("Subscription fulfilled for user", userId);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
	const stripeSubscriptionId = invoice.parent?.subscription_details
		?.subscription as string | undefined;

	if (!stripeSubscriptionId) {
		console.log("Invoice not tied to a subscription, skipping");
		return;
	}

	const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
	const item = stripeSub.items.data[0];

	await client.subscription.updateMany({
		where: { stripeSubscriptionId },
		data: {
			status: "ACTIVE",
			currentPeriodStart: new Date(item.current_period_start * 1000),
			currentPeriodEnd: new Date(item.current_period_end * 1000),
		},
	});

	console.log("Renewed subscription", stripeSubscriptionId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	await client.subscription.updateMany({
		where: { stripeSubscriptionId: subscription.id },
		data: {
			plan: "FREE",
			status: "CANCELED", // make sure this matches your SubStatus enum exactly
			cancelAtPeriodEnd: false,
		},
	});

	console.log("Subscription canceled and downgraded:", subscription.id);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	const item = subscription.items.data[0];

	await client.subscription.updateMany({
		where: { stripeSubscriptionId: subscription.id },
		data: {
			status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE", // match your enum values
			cancelAtPeriodEnd: subscription.cancel_at_period_end,
			currentPeriodStart: new Date(item.current_period_start * 1000),
			currentPeriodEnd: new Date(item.current_period_end * 1000),
		},
	});

	console.log("Subscription updated:", subscription.id);
}
