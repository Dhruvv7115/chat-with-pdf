import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

export async function POST() {
	try {
		const headersList = await headers();
		const origin = headersList.get("origin");

		// Create Checkout Sessions from body params.
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					// Provide the exact Price ID (for example, price_1234) of the product you want to sell
					price: process.env.STRIPE_PRO_PRICE_ID!,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billings?success=true`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billings?canceled=true`,
		});
		return NextResponse.json({ url: session.url });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err.message },
			{ status: err.statusCode || 500 },
		);
	}
}
