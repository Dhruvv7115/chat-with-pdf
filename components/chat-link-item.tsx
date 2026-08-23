import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
	chat: {
		id: string;
		title: string;
		createdAt: string;
	};
	isActive: boolean;
}

function ChatLinkItem({ chat, isActive }: Props) {
	const [isRowHovered, setIsRowHovered] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLSpanElement>(null);
	const [scrollDistance, setScrollDistance] = useState(0);

	useEffect(() => {
		if (containerRef.current && textRef.current) {
			const containerWidth = containerRef.current.offsetWidth;
			const textWidth = textRef.current.offsetWidth;

			if (textWidth > containerWidth) {
				setScrollDistance(textWidth - containerWidth);
			} else {
				setScrollDistance(0);
			}
		}
	}, [chat.title]);

	// Calculates the smooth scrolling animation time based on text length
	const duration =
		isRowHovered && scrollDistance > 0 ? `${scrollDistance / 30}s` : "0.4s";

	return (
		<Link
			href={`/chat/${chat.id}`}
			onMouseEnter={() => setIsRowHovered(true)}
			onMouseLeave={() => setIsRowHovered(false)}
			className={cn(
				"relative flex items-center justify-start rounded-md px-4 py-2 text-sm font-normal w-full overflow-hidden transition-colors duration-200",
				"text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white",
				isActive
					? "bg-neutral-200/60 dark:bg-neutral-500/20 font-medium text-neutral-900 dark:text-white"
					: "hover:bg-neutral-500/10",
			)}
		>
			<div
				ref={containerRef}
				className="relative z-10 w-full overflow-hidden whitespace-nowrap"
			>
				<span
					ref={textRef}
					className="inline-block transition-transform ease-linear"
					style={{
						// Moves natively on the GPU without triggering browser repaints or layout checks
						transform:
							isRowHovered && scrollDistance > 0
								? `translateX(-${scrollDistance}px)`
								: "translateX(0px)",
						transitionDuration: duration,
					}}
				>
					{chat.title}
				</span>
			</div>
		</Link>
	);
}

export default ChatLinkItem;
