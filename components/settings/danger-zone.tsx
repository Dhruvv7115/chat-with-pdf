import { cn } from "@/lib/utils";
import { commonDotStyles } from "@/lib/styles";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const DangerZone = () => {
	function handleDeleteAllPdfs() {
		// TODO: api.pdf.deleteAll.mutate()
		console.log("delete all pdfs");
	}

	function handleDeleteAccount() {
		// TODO: api.user.deleteAccount.mutate()
		console.log("delete account");
	}
	return (
		<Card
			className={cn(
				"flex flex-col h-full rounded-3xl p-2",
				"border border-neutral-100 dark:border-neutral-800",
				"bg-white dark:bg-neutral-900",
			)}
		>
			<CardHeader className="rounded-xl bg-neutral-200 dark:bg-neutral-800 py-4">
				<CardTitle className="text-base font-medium text-destructive">
					Danger zone
				</CardTitle>

				<CardDescription>
					These actions are permanent and cannot be undone.
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-4 w-full lg:p-2 p-0">
				{/* Delete PDFs */}
				<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-muted shadow-[inset_1px_1px_2px_0_rgba(255,0,0,0.1),inset_-1px_-1px_2px_0_rgba(255,0,0,0.1)]">
					<div>
						<p className="text-sm font-medium">Delete all PDFs</p>

						<p className="text-xs text-muted-foreground">
							Remove all uploaded PDFs and their chat histories
						</p>
					</div>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-7 shrink-0 text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
							>
								Delete all
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete all PDFs?</AlertDialogTitle>

								<AlertDialogDescription>
									This will permanently delete all your uploaded PDFs and their
									chat histories. This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>

								<AlertDialogAction
									variant="destructive"
									onClick={handleDeleteAllPdfs}
									className="bg-destructive hover:bg-destructive/90"
								>
									Delete all
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>

				{/* Delete account */}
				<div className="flex items-center justify-between gap-4 rounded-lg bg-muted px-4 py-3 shadow-[inset_1px_1px_2px_0_rgba(255,0,0,0.1),inset_-1px_-1px_2px_0_rgba(255,0,0,0.1)]">
					<div>
						<p className="text-sm font-medium">Delete account</p>

						<p className="text-xs text-muted-foreground">
							Permanently delete your account and all data
						</p>
					</div>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-7 shrink-0 text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
							>
								Delete account
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete your account?</AlertDialogTitle>

								<AlertDialogDescription>
									This will permanently delete your account, all uploaded PDFs,
									and all chat histories. This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>

								<AlertDialogAction
									variant="destructive"
									onClick={handleDeleteAccount}
									className="bg-destructive hover:bg-destructive/90"
								>
									Delete account
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardContent>
		</Card>
	);
};

export default DangerZone;
