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
import { commonDotStyles } from "@/lib/styles";

const PasswordSection = () => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	function handleUpdatePassword() {
		if (newPassword !== confirmPassword) {
			alert("Passwords don't match");
			return;
		}
		// TODO: call your tRPC mutation here e.g. api.user.updatePassword.mutate(...)
		console.log("update password");
	}
	return (
		<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
			<span className={cn("-top-0.5 -left-0.5", commonDotStyles)} />
			<span className={cn("-top-0.5 -right-0.5", commonDotStyles)} />
			<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)} />
			<span className={cn("-bottom-0.5 -right-0.5", commonDotStyles)} />

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-medium">Password</CardTitle>

					<CardDescription>
						Change your password to keep your account secure
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="grid md:grid-cols-3 gap-4">
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs">Current password</Label>

							<Input
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								placeholder="••••••••"
							/>
						</div>

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
							size="sm"
							onClick={handleUpdatePassword}
						>
							Update password
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default PasswordSection;
