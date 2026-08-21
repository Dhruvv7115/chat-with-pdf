import { cn } from "@/lib/utils";
import { commonDotStyles } from "@/lib/styles";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Google, Github } from "@thesvg/react";

const AccountsSection = () => {
	return (
		<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
			<span className={cn("-top-0.5 -left-0.5", commonDotStyles)} />
			<span className={cn("-top-0.5 -right-0.5", commonDotStyles)} />
			<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)} />
			<span className={cn("-bottom-0.5 -right-0.5", commonDotStyles)} />

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-medium">
						Connected accounts
					</CardTitle>

					<CardDescription>
						Manage the accounts connected to your account
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-3">
					{/* Google */}
					<div className="flex items-center justify-between rounded-lg border px-4 py-3">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center">
								<Google />
							</div>

							<div>
								<p className="text-sm font-medium">Google</p>

								<p className="text-xs text-muted-foreground">
									Connected account
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<span className="rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
								Connected
							</span>

							<Button
								variant="outline"
								size="sm"
								className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
							>
								Disconnect
							</Button>
						</div>
					</div>

					{/* GitHub */}
					<div className="flex items-center justify-between rounded-lg border px-4 py-3">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center">
								<Github />
							</div>

							<div>
								<p className="text-sm font-medium">GitHub</p>

								<p className="text-xs text-muted-foreground">
									Connect your GitHub account
								</p>
							</div>
						</div>

						<Button
							variant="outline"
							size="sm"
							className="h-7 text-xs"
						>
							Connect
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default AccountsSection;
