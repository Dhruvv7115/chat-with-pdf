import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Skeleton className="size-6 rounded-md" />
					<Skeleton className="h-6 w-28" />
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs space-y-4">
						<div className="space-y-2 text-center">
							<Skeleton className="h-7 w-36 mx-auto" />
							<Skeleton className="h-4 w-48 mx-auto" />
						</div>
						<div className="space-y-3 pt-4">
							<Skeleton className="h-10 w-full rounded-md" />
							<Skeleton className="h-10 w-full rounded-md" />
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:flex items-center justify-center">
				<div className="flex flex-col items-center justify-center gap-4 max-w-xl text-center">
					<Skeleton className="size-16 rounded-xl" />
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-4 w-96" />
					<Skeleton className="h-10 w-48 rounded-xl mt-2" />
				</div>
			</div>
		</div>
	);
}
