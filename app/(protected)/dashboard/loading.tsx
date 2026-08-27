import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<div className="bg-sidebar h-full overflow-auto">
			<div className="mx-auto px-6 py-8 flex flex-col gap-8">
				{/* Header */}
				<div className="space-y-2">
					<Skeleton className="h-9 w-64 md:w-80" />
					<Skeleton className="h-4 w-72" />
				</div>

				{/* Stat Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<Card
							key={i}
							className="flex flex-col h-full rounded-3xl p-2 border border-neutral-100 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800"
						>
							<CardHeader className="rounded-xl bg-white dark:bg-neutral-900 py-4 space-y-0">
								<div className="flex flex-row items-center justify-between pb-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="size-6 rounded-md" />
								</div>
								<div className="mt-3">
									<Skeleton className="h-8 w-16" />
								</div>
							</CardHeader>
						</Card>
					))}
				</div>

				{/* Activity Chart Skeleton */}
				<Card className="rounded-2xl border bg-card p-6">
					<div className="flex items-center justify-between pb-6">
						<div className="space-y-1.5">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-3.5 w-60" />
						</div>
						<Skeleton className="h-8 w-28 rounded-md" />
					</div>
					<Skeleton className="h-56 w-full rounded-xl" />
				</Card>

				{/* Main Panels Grid (Recent Docs & Recent Chats) */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{/* Recent Docs Panel */}
					<Card className="rounded-2xl border bg-card p-5 space-y-4">
						<div className="flex items-center justify-between">
							<Skeleton className="h-5 w-36" />
							<Skeleton className="h-4 w-16" />
						</div>
						<div className="space-y-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20"
								>
									<div className="flex items-center gap-3 flex-1 min-w-0">
										<Skeleton className="h-10 w-8 rounded" />
										<div className="space-y-1.5 flex-1 min-w-0">
											<Skeleton className="h-4 w-3/4" />
											<Skeleton className="h-3 w-1/3" />
										</div>
									</div>
									<Skeleton className="h-7 w-16 rounded" />
								</div>
							))}
						</div>
					</Card>

					{/* Recent Chats Panel */}
					<Card className="rounded-2xl border bg-card p-5 space-y-4">
						<div className="flex items-center justify-between">
							<Skeleton className="h-5 w-36" />
							<Skeleton className="h-4 w-16" />
						</div>
						<div className="space-y-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20"
								>
									<div className="flex items-center gap-3 flex-1 min-w-0">
										<Skeleton className="size-8 rounded-lg shrink-0" />
										<div className="space-y-1.5 flex-1 min-w-0">
											<Skeleton className="h-4 w-3/4" />
											<Skeleton className="h-3 w-1/2" />
										</div>
									</div>
									<Skeleton className="h-7 w-16 rounded" />
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
