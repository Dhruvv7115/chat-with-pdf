import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
	return (
		<main className="p-4 flex flex-col items-center justify-start gap-6 w-full h-full bg-sidebar">
			{/* Header */}
			<div className="mb-6 space-y-2 text-center flex flex-col items-center">
				<Skeleton className="h-10 w-72 md:w-80" />
				<Skeleton className="h-4 w-60" />
			</div>

			{/* Desktop Layout: Dropzone (left) + Input (right) */}
			<div className="hidden md:grid md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
				{/* File Dropzone Skeleton */}
				<Card className="h-72 flex flex-col items-center justify-center p-6 border-dashed border-2">
					<Skeleton className="size-12 rounded-full mb-4" />
					<Skeleton className="h-4 w-48 mb-2" />
					<Skeleton className="h-3 w-32" />
				</Card>

				{/* Chat Start Input Skeleton */}
				<Card className="h-72 flex flex-col justify-between p-4">
					<Skeleton className="h-24 w-full rounded-md" />
					<div className="flex items-center justify-between pt-4 border-t">
						<Skeleton className="size-9 rounded-full" />
						<div className="flex items-center gap-2">
							<Skeleton className="size-9 rounded-full" />
							<Skeleton className="size-9 rounded-full" />
						</div>
					</div>
				</Card>
			</div>

			{/* Mobile Layout Skeleton */}
			<div className="flex md:hidden w-full max-w-xl mx-auto">
				<Card className="w-full p-4 space-y-4">
					<Skeleton className="h-24 w-full rounded-md" />
					<div className="flex items-center justify-between pt-2 border-t">
						<Skeleton className="size-9 rounded-full" />
						<div className="flex items-center gap-2">
							<Skeleton className="size-9 rounded-full" />
							<Skeleton className="size-9 rounded-full" />
						</div>
					</div>
				</Card>
			</div>
		</main>
	);
}
