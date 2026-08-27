import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatsLoading() {
	return (
		<div className="p-6 mx-auto space-y-6 w-full min-h-full bg-sidebar">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
				<div className="space-y-2">
					<div className="flex items-center gap-2.5">
						<Skeleton className="h-8 w-52" />
						<Skeleton className="h-5 w-16 rounded-full" />
					</div>
					<Skeleton className="h-4 w-80" />
				</div>
				<Skeleton className="h-10 w-28 rounded-md" />
			</div>

			{/* Filter Tabs & Search Bar */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex gap-2 p-1 bg-muted/40 rounded-lg">
					<Skeleton className="h-8 w-24 rounded-md" />
					<Skeleton className="h-8 w-32 rounded-md" />
					<Skeleton className="h-8 w-32 rounded-md" />
				</div>
				<Skeleton className="h-10 w-full sm:w-80 rounded-md" />
			</div>

			{/* Chat Row Cards List */}
			<div className="flex flex-col gap-2.5">
				{Array.from({ length: 6 }).map((_, i) => (
					<Card
						key={i}
						className="p-4"
					>
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-4 flex-1 min-w-0">
								<Skeleton className="size-10 rounded-lg shrink-0" />
								<div className="flex flex-col gap-2 flex-1 min-w-0">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-3 w-1/4" />
								</div>
							</div>
							<Skeleton className="h-8 w-20 rounded-md" />
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
