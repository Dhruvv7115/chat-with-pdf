import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingsLoading() {
	return (
		<div className="bg-sidebar min-h-full">
			<div className="mx-auto px-6 py-6 space-y-8">
				{/* Header */}
				<div className="mb-8 space-y-2">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-4 w-64" />
				</div>

				{/* Current plan summary skeleton */}
				<Card className="p-6">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-6 w-28" />
								<Skeleton className="h-5 w-16 rounded-full" />
							</div>
							<Skeleton className="h-4 w-72" />
						</div>
						<Skeleton className="h-10 w-36 rounded-md" />
					</div>
					<div className="mt-6 space-y-2">
						<div className="flex justify-between">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-16" />
						</div>
						<Skeleton className="h-2 w-full rounded-full" />
					</div>
				</Card>

				{/* Pricing plans skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<Card
							key={i}
							className="p-6 space-y-6 flex flex-col justify-between"
						>
							<div className="space-y-4">
								<div className="space-y-2">
									<Skeleton className="h-6 w-24" />
									<Skeleton className="h-4 w-48" />
								</div>
								<Skeleton className="h-10 w-32" />
								<div className="space-y-2.5 pt-4 border-t">
									{Array.from({ length: 4 }).map((_, j) => (
										<div
											key={j}
											className="flex items-center gap-2"
										>
											<Skeleton className="size-4 rounded-full" />
											<Skeleton className="h-3.5 w-40" />
										</div>
									))}
								</div>
							</div>
							<Skeleton className="h-10 w-full rounded-md" />
						</Card>
					))}
				</div>

				{/* Invoice history skeleton */}
				<Card className="p-6 space-y-4">
					<Skeleton className="h-6 w-36" />
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
							>
								<div className="space-y-1.5">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
								</div>
								<Skeleton className="h-4 w-16" />
							</div>
						))}
					</div>
				</Card>
			</div>
		</div>
	);
}
