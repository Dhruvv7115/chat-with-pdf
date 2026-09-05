"use client";

import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import SectionHeader from "../section-header";

const content = [
	{
		title: "Upload Your PDF",
		description:
			"Drag and drop any research paper, financial report, legal contract, or textbook. Our system parses complex formatting, tables, and multi-column layouts in seconds.",
		content: (
			<div className="flex h-full w-full items-center justify-center text-white font-medium text-center p-4">
				{/* Add your image or gif here */}
				<span>Upload PDF Preview</span>
			</div>
		),
	},
	{
		title: "Receive an Instant Summary",
		description:
			"Get a comprehensive executive overview of key takeaways, core findings, and critical data points synthesized automatically by AI.",
		content: (
			<div className="flex h-full w-full items-center justify-center text-white font-medium text-center p-4">
				{/* Add your image or gif here */}
				<span>Instant Summary Preview</span>
			</div>
		),
	},
	{
		title: "Ask Questions in Natural Language",
		description:
			"Chat naturally with your document. Ask specific questions, request cross-section comparisons, or have difficult technical concepts explained simply.",
		content: (
			<div className="flex h-full w-full items-center justify-center text-white font-medium text-center p-4">
				{/* Add your image or gif here */}
				<span>Document Chat Preview</span>
			</div>
		),
	},
	{
		title: "Contextual Answers & Page Citations",
		description:
			"Receive accurate answers backed by exact page and paragraph citations. Click any reference to verify claims directly against the source document.",
		content: (
			<div className="flex h-full w-full items-center justify-center text-white font-medium text-center p-4">
				{/* Add your image or gif here */}
				<span>Page Citations Preview</span>
			</div>
		),
	},
];

export function HowItWorksSection() {
	return (
		<section
			id="how-it-works"
			className="w-full scroll-mt-24 bg-background text-accent-foreground"
		>
			<SectionHeader
				heading="How It Works?"
				description="Four simple steps from dense documents to verified answers and page citations."
			/>
			<div className="px-6 relative">
				<StickyScroll content={content} />
			</div>
		</section>
	);
}

export default HowItWorksSection;
