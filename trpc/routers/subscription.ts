import { protectedProcedure, createTRPCRouter } from "../init";
import { client } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { stripe } from "@/lib/stripe";

export const subscriptionRouter = createTRPCRouter({
	createProSubscription: protectedProcedure.query(async ({ ctx }) => {
		const pro = await client.subscription.create({
			data: {
				userId: ctx.userId,
				plan: "PRO",
			},
		});
	}),

	getInvoices: protectedProcedure.query(async ({ ctx }) => {
		// Get user's subscription with Stripe customer ID
		const subscription = await client.subscription.findUnique({
			where: { userId: ctx.userId },
		});

		if (!subscription?.stripeCustomerId) {
			return [];
		}

		// Fetch invoices from Stripe
		const invoices = await stripe.invoices.list({
			customer: subscription.stripeCustomerId,
			limit: 100,
		});

		// Format invoices for display
		return invoices.data.map((invoice) => ({
			id: invoice.id,
			invoice: invoice.number || "N/A",
			date: new Date(invoice.created * 1000).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			}),
			paymentStatus: invoice.status === "paid" ? "Paid" : "Unpaid",
			paymentMethod: "Card",
			totalAmount: `₹${(invoice.total / 100).toFixed(2)}`,
			pdfUrl: invoice.invoice_pdf,
		}));
	}),

	getCurrentPlan: protectedProcedure.query(async ({ ctx }) => {
		const subscription = await client.subscription.findUnique({
			where: { userId: ctx.userId },
		});

		// Map database enum to plan name
		const planMap = {
			FREE: "Hobby",
			PRO: "Pro",
			TEAM: "Enterprise",
		};

		return planMap[subscription?.plan || "FREE"];
	}),
});
