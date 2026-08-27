import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
			{/* Navbar placeholder */}
			<div className="fixed top-6 w-full max-w-4xl px-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Skeleton className="size-8 rounded-lg" />
					<Skeleton className="h-6 w-32" />
				</div>
				<div className="flex items-center gap-3">
					<Skeleton className="h-9 w-20 rounded-full" />
					<Skeleton className="h-9 w-24 rounded-full" />
				</div>
			</div>

			{/* Main hero placeholder */}
			<div className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl mt-32">
				<Skeleton className="h-14 w-80 md:w-96 rounded-xl" />
				<Skeleton className="h-6 w-full max-w-md" />
				<Skeleton className="h-4 w-3/4 max-w-sm" />
				<Skeleton className="h-12 w-36 rounded-full mt-4" />
			</div>
		</div>
	);
}
