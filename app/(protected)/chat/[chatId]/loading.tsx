import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatDetailLoading() {
	return (
		<div className="h-full w-full bg-sidebar flex flex-col md:flex-row overflow-hidden">
			{/* Left side: Document preview panel skeleton */}
			<div className="hidden md:flex flex-col flex-1 h-full border-r bg-background/50 p-4 space-y-4">
				{/* Top toolbar */}
				<div className="flex items-center justify-between border-b pb-3">
					<div className="flex items-center gap-2">
						<Skeleton className="size-8 rounded-md" />
						<Skeleton className="h-5 w-48" />
					</div>
					<div className="flex items-center gap-2">
						<Skeleton className="size-8 rounded-md" />
						<Skeleton className="h-5 w-16" />
						<Skeleton className="size-8 rounded-md" />
					</div>
				</div>
				{/* Document canvas page skeleton */}
				<div className="flex-1 flex items-center justify-center p-4">
					<Skeleton className="h-full w-4/5 max-w-lg rounded-lg shadow-sm" />
				</div>
			</div>

			{/* Right side: Chat conversation & input skeleton */}
			<div className="flex flex-col flex-1 h-full bg-sidebar">
				{/* Messages area */}
				<div className="flex-1 p-6 space-y-6 overflow-y-auto">
					{/* AI greeting message skeleton */}
					<div className="flex gap-3 max-w-xl">
						<Skeleton className="size-8 rounded-full shrink-0" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-1/4" />
							<Skeleton className="h-16 w-full rounded-2xl" />
						</div>
					</div>

					{/* User message skeleton */}
					<div className="flex gap-3 max-w-md ml-auto justify-end">
						<div className="space-y-2 flex-1 flex flex-col items-end">
							<Skeleton className="h-4 w-1/4" />
							<Skeleton className="h-12 w-3/4 rounded-2xl" />
						</div>
						<Skeleton className="size-8 rounded-full shrink-0" />
					</div>

					{/* AI response message skeleton */}
					<div className="flex gap-3 max-w-xl">
						<Skeleton className="size-8 rounded-full shrink-0" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-1/4" />
							<Skeleton className="h-24 w-full rounded-2xl" />
						</div>
					</div>
				</div>

				{/* Chat Input skeleton at bottom */}
				<div className="p-4 max-w-4xl w-full mx-auto">
					<Card className="p-3 rounded-3xl flex flex-col gap-2">
						<Skeleton className="h-12 w-full rounded-xl" />
						<div className="flex items-center justify-between pt-1">
							<Skeleton className="size-8 rounded-full" />
							<div className="flex items-center gap-2">
								<Skeleton className="size-8 rounded-full" />
								<Skeleton className="size-8 rounded-full" />
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
