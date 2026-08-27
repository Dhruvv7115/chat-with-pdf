import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
	return (
		<div className="bg-sidebar min-h-full">
			<div className="mx-auto px-6 py-6 space-y-8 max-w-4xl">
				{/* Header */}
				<div className="mb-8 space-y-2">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-4 w-56" />
				</div>

				{/* Profile section skeleton */}
				<Card className="p-6 space-y-6">
					<div className="space-y-1">
						<Skeleton className="h-6 w-36" />
						<Skeleton className="h-4 w-60" />
					</div>
					<div className="flex items-center gap-4">
						<Skeleton className="size-16 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-8 w-28 rounded-md" />
							<Skeleton className="h-3 w-40" />
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
					</div>
					<Skeleton className="h-9 w-24 rounded-md" />
				</Card>

				{/* Preferences section skeleton */}
				<Card className="p-6 space-y-6">
					<div className="space-y-1">
						<Skeleton className="h-6 w-36" />
						<Skeleton className="h-4 w-64" />
					</div>
					<div className="space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
							>
								<div className="space-y-1">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-48" />
								</div>
								<Skeleton className="h-6 w-11 rounded-full" />
							</div>
						))}
					</div>
				</Card>

				{/* Password section skeleton */}
				<Card className="p-6 space-y-6">
					<div className="space-y-1">
						<Skeleton className="h-6 w-36" />
						<Skeleton className="h-4 w-52" />
					</div>
					<div className="space-y-3 max-w-md">
						<Skeleton className="h-10 w-full rounded-md" />
						<Skeleton className="h-10 w-full rounded-md" />
						<Skeleton className="h-9 w-32 rounded-md" />
					</div>
				</Card>
			</div>
		</div>
	);
}
