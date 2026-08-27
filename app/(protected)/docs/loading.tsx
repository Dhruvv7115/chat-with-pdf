import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocsLoading() {
	return (
		<div className="p-6 mx-auto space-y-6 w-full min-h-full bg-sidebar">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
				<div className="space-y-2">
					<div className="flex items-center gap-2.5">
						<Skeleton className="h-8 w-44" />
						<Skeleton className="h-5 w-16 rounded-full" />
					</div>
					<Skeleton className="h-4 w-72" />
				</div>
				<Skeleton className="h-10 w-44 rounded-md" />
			</div>

			{/* Filter Tabs & Search Bar */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex flex-wrap gap-2 p-1 bg-muted/40 rounded-lg">
					<Skeleton className="h-8 w-24 rounded-md" />
					<Skeleton className="h-8 w-24 rounded-md" />
					<Skeleton className="h-8 w-24 rounded-md" />
					<Skeleton className="h-8 w-24 rounded-md" />
				</div>
				<Skeleton className="h-10 w-full md:w-72 rounded-md" />
			</div>

			{/* Document Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<Card
						key={i}
						className="overflow-hidden py-0"
					>
						<CardHeader className="p-4 space-y-2 border-b bg-muted/30">
							<div className="flex items-center gap-2">
								<Skeleton className="size-7 rounded" />
								<Skeleton className="h-4 w-2/3" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-20" />
							</div>
						</CardHeader>
						<Skeleton className="h-48 w-full rounded-none" />
						<CardFooter className="p-3 flex justify-between gap-2">
							<Skeleton className="h-8 w-24" />
							<Skeleton className="h-8 w-24" />
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
