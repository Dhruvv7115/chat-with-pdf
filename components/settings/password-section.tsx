import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

const PasswordSection = () => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const updatePassword = api.user.updatePassword.useMutation();

	function handleUpdatePassword() {
		if (!currentPassword) {
			toast.info("Please enter your current password");
			return;
		}
		if (newPassword.length < 8) {
			toast.info("New password must be at least 8 characters");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("Passwords don't match");
			return;
		}

		updatePassword.mutate(
			{ currentPassword, newPassword },
			{
				onSuccess: () => {
					toast.success("Password updated successfully");
					setCurrentPassword("");
					setNewPassword("");
					setConfirmPassword("");
					setTimeout(() => {
						updatePassword.reset();
					}, 2000);
				},
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	}
	return (
		<Card
			className={cn(
				"flex flex-col h-full rounded-3xl p-2",
				"border border-neutral-100 dark:border-neutral-800",
				"bg-white dark:bg-neutral-900",
				"col-span-1"
			)}
		>
			<CardHeader className="rounded-xl bg-neutral-200 dark:bg-neutral-800 py-4">
				<CardTitle className="text-base font-medium">Password</CardTitle>

				<CardDescription>
					Change your password to keep your account secure
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-4 items-start justify-center">
				<div className="flex flex-col gap-1.5 w-full">
					<Label className="text-xs">Current password</Label>

					<Input
						type="password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						placeholder="••••••••"
					/>
				</div>
				<div className="grid md:grid-cols-2 gap-4 w-full">
					<div className="flex flex-col gap-1.5">
						<Label className="text-xs">New password</Label>

						<Input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="••••••••"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-xs">Confirm new password</Label>

						<Input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••"
						/>
					</div>
				</div>

				<div className="flex justify-end pt-1">
					<Button
						onClick={handleUpdatePassword}
						disabled={updatePassword.isPending || updatePassword.isSuccess}
						className="w-36 relative overflow-hidden transition-none"
					>
						<AnimatePresence
							initial={false}
							mode="wait"
						>
							{updatePassword.isSuccess ? (
								<motion.div
									key="success"
									initial={{ width: 0, opacity: 0 }}
									animate={{ width: "auto", opacity: 1 }}
									exit={{ width: 0, opacity: 0 }}
									transition={{
										duration: 0.25,
										ease: "easeInOut",
									}}
									className="flex items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap text-neutral-50"
								>
									<motion.svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="size-4"
									>
										<motion.path
											d="M5 12l5 5L20 7"
											initial={{ pathLength: 0 }}
											animate={{ pathLength: 1 }}
											transition={{
												duration: 0.4,
												ease: "easeInOut",
											}}
										/>
									</motion.svg>

									<motion.span
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{
											duration: 0.4,
											ease: "easeInOut",
										}}
									>
										Updated
									</motion.span>
								</motion.div>
							) : updatePassword.isPending ? (
								<motion.div
									key="loader"
									initial={{ width: 0, opacity: 0 }}
									animate={{ width: "auto", opacity: 1 }}
									exit={{ width: 0, opacity: 0 }}
									transition={{
										duration: 0.25,
										ease: "easeInOut",
									}}
									className="flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap"
								>
									<IconLoader className="size-3.5 animate-spin" />
									<span>Updating...</span>
								</motion.div>
							) : (
								<motion.div
									key="text"
									initial={{ width: 0, opacity: 0 }}
									animate={{ width: "auto", opacity: 1 }}
									exit={{ width: 0, opacity: 0 }}
									transition={{
										duration: 0.25,
										ease: "easeInOut",
									}}
									className="flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap"
								>
									<span>Update password</span>
								</motion.div>
							)}
						</AnimatePresence>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default PasswordSection;
