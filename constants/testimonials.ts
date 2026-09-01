interface Testimonial {
	name: string;
	role: string;
	avatar: string;
	text: string;
	highlight: string;
}
const testimonials: Testimonial[] = [
	{
		name: "Alex Rivera",
		role: "ML Researcher at InnovateLab",
		avatar:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
		text: "Analyzing 45-page arXiv preprints used to take entire afternoons. ",
		highlight:
			"Page-specific citations make verifying facts effortless and 10x faster.",
	},
	{
		name: "Aisha Khan",
		role: "Graduate Student & TA",
		avatar:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
		text: "Extracting thesis methodology and synthesizing comparative literature has never been this smooth. ",
		highlight: "Essential for literature reviews and finals prep.",
	},
	{
		name: "Jake Morrison",
		role: "Financial Analyst",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
		text: "Querying dense quarterly earnings tables and extracting multi-page balance sheets directly into markdown. ",
		highlight: "Saved hours of manual data copying.",
	},
	{
		name: "Samantha Lee",
		role: "Legal Tech Consultant",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
		text: "The accuracy on clause cross-referencing is top notch. ",
		highlight: "Finds nuanced contract contradictions in seconds.",
	},
	{
		name: "Carlos Gomez",
		role: "Data Engineer",
		avatar:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
		text: "Zero hallucination issues when asking for direct numbers and formulas. ",
		highlight: "Easily the best document RAG implementation I have tested.",
	},
	{
		name: "Nadia Ali",
		role: "Product Strategy Lead",
		avatar:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
		text: "Summarizes 80-page user feedback reports into crisp action items. ",
		highlight: "Accelerated our roadmap planning cycle drastically.",
	},
] as const;

export { testimonials, type Testimonial };
