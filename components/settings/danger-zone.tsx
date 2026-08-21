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
		<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-destructive/30 lg:p-6 md:p-4 p-2 relative">
			<span
				className={cn("-top-0.5 -left-0.5", "bg-destructive", commonDotStyles)}
			/>
			<span
				className={cn("-top-0.5 -right-0.5", "bg-destructive", commonDotStyles)}
			/>
			<span
				className={cn(
					"-bottom-0.5 -left-0.5",
					"bg-destructive",
					commonDotStyles,
				)}
			/>
			<span
				className={cn(
					"-bottom-0.5 -right-0.5",
					"bg-destructive",
					commonDotStyles,
				)}
			/>

			<Card className="border-destructive/30">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-medium text-destructive">
						Danger zone
					</CardTitle>

					<CardDescription>
						These actions are permanent and cannot be undone.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-3">
					{/* Delete PDFs */}
					<div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/20 px-4 py-3">
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
										This will permanently delete all your uploaded PDFs and
										their chat histories. This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>

									<AlertDialogAction
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
					<div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/20 px-4 py-3">
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
										This will permanently delete your account, all uploaded
										PDFs, and all chat histories. This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>

									<AlertDialogAction
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
		</div>
	);
};

export default DangerZone;
