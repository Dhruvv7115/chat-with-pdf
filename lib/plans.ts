export const PLANS = [
	{
		name: "Hobby",
		price: "$0",
		period: "forever",
		description: "For people trying out Chat with PDF for the first time.",
		features: ["5 PDF uploads", "50 messages / month", "Basic chat"],
		current: true,
	},
	{
		name: "Pro",
		price: "$12",
		period: "Month",
		description: "For teams that need more power and flexibility.",

		features: [
			"Unlimited PDF uploads",
			"Unlimited messages",
			"Priority processing",
			"Export chat history",
		],
		current: false,
	},
	{
		name: "Enterprise",
		price: "$39",
		period: "Month",
		description: "For large organizations with custom needs.",

		features: [
			"Everything in Pro",
			"Up to 10 seats",
			"Shared PDF library",
			"Admin controls",
		],
		current: false,
	},
] as const;
