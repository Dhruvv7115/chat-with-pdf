"use client";

import { cn } from "@/lib/utils";

const Container = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("max-w-7xl mx-auto border-x relative", className)}>
			<div className="block w-px h-full border-l border-border absolute top-0 md:left-6 left-4 z-10" />
			<div className="block w-px h-full border-r border-border absolute top-0 md:right-6 right-4 z-10" />
			{children}
		</div>
	);
};

export default Container;
