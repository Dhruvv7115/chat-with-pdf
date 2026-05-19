"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRefetch } from "@/hooks/use-refetch";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { api } from "@/trpc/client";

function getInitials(firstName?: string | null, lastName?: string | null) {
	return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

export default function SettingsPage() {
	const { data: session } = useSession();
	const { data: profile } = api.user.getProfile.useQuery();
	const refetch = useRefetch();

	const user = session?.user;
	console.log("profile from db: ", profile);

	const updateProfile = api.user.updateProfile.useMutation();

	// Profile form state
	const [firstName, setFirstName] = useState(
		profile?.firstName ?? user?.name?.split(" ")[0] ?? "",
	);
	const [lastName, setLastName] = useState(
		profile?.lastName ?? user?.name?.split(" ")[1] ?? "",
	);
	const [email, setEmail] = useState(profile?.email ?? user?.email ?? "");
	const [userAvatar, setUserAvatar] = useState<string>("");
	const [userAvatarFile, setUserAvatarFile] = useState<File>();

	// Password form state
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	function handleSaveProfile() {
		// TODO: call your tRPC mutation here e.g. api.user.updateProfile.mutate(...)
		if (
			!firstName.trim() &&
			!lastName.trim() &&
			!email.trim() &&
			!userAvatarFile
		) {
			toast.info("Please change atleast one attribute.");
			return;
		}
		interface ProfileChanges {
			firstName?: string;
			lastName?: string;
			userAvatar?: File;
			email?: string;
		}
		let obj: ProfileChanges = {};
		if (firstName.trim() !== "") obj.firstName = firstName;
		if (lastName.trim() !== "") obj.lastName = lastName;
		if (email.trim() !== "") obj.email = email;
		if (userAvatarFile) obj.userAvatar = userAvatarFile;

		console.log("save profile", { firstName, lastName, email });
		updateProfile.mutate(obj, {
			onSuccess: () => {
				refetch();
				toast.success("Profile updated successfully");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	}

	function handleUpdatePassword() {
		if (newPassword !== confirmPassword) {
			alert("Passwords don't match");
			return;
		}
		// TODO: call your tRPC mutation here e.g. api.user.updatePassword.mutate(...)
		console.log("update password");
	}

	function handleDeleteAllPdfs() {
		// TODO: api.pdf.deleteAll.mutate()
		console.log("delete all pdfs");
	}

	function handleDeleteAccount() {
		// TODO: api.user.deleteAccount.mutate()
		console.log("delete account");
	}
	useEffect(() => {
		console.log(typeof userAvatar, " ", userAvatar);
	}, [userAvatar]);

	return (
		<div className="mx-auto p-6 flex flex-col gap-4">
			<div className="mb-2">
				<h1 className="text-2xl font-bold text-accent-foreground">Settings</h1>
				<p className="text-sm text-muted-foreground">
					Manage your account preferences
				</p>
			</div>

			{/* ── Profile ── */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle>Profile</CardTitle>
					<CardDescription>Edit your profile</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					{/* Avatar row */}
					<div className="flex items-center gap-4">
						<Avatar className="w-20 h-20">
							<AvatarImage
								src={
									userAvatar.trim() !== ""
										? userAvatar
										: (user?.avatar ?? undefined)
								}
							/>
							<AvatarFallback>
								{getInitials(firstName, lastName)}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium">
								{profile?.firstName} {profile?.lastName}{" "}
								{!profile?.firstName && !profile?.lastName && user?.name}
							</p>
							<p className="text-xs text-muted-foreground mb-2">
								{user?.email}
							</p>
							<Button
								variant="outline"
								size="sm"
								className="text-xs h-7 relative"
							>
								<input
									type="file"
									accept="image/*"
									className="inset-0 absolute opacity-0 border"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											setUserAvatarFile(file);
											setUserAvatar(URL.createObjectURL(file)); // temporary local URL
										}
									}}
								/>
								Change avatar
							</Button>
						</div>
					</div>

					{/* Name fields */}
					<div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs">First name</Label>
							<Input
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder="John"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs">Last name</Label>
							<Input
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								placeholder="Doe"
							/>
						</div>
					</div>

					<div className="flex justify-end">
						<Button onClick={handleSaveProfile}>Save changes</Button>
					</div>
				</CardContent>
			</Card>

			{/* ── Password ── */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium">Password</CardTitle>
					<CardDescription>Reset your password</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
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

					<div className="flex justify-end">
						<Button
							size="sm"
							onClick={handleUpdatePassword}
						>
							Update password
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* ── Connected accounts ── */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium">
						Connected accounts
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{/* Google */}
					<div className="flex items-center justify-between px-3 py-2.5 border rounded-lg">
						<div className="flex items-center gap-2.5">
							<GoogleIcon />
							<span className="text-sm">Google</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-xs px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200">
								Connected
							</span>
							<Button
								variant="outline"
								size="sm"
								className="text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/5"
							>
								Disconnect
							</Button>
						</div>
					</div>

					{/* GitHub */}
					<div className="flex items-center justify-between px-3 py-2.5 border rounded-lg">
						<div className="flex items-center gap-2.5">
							<GithubIcon />
							<span className="text-sm">GitHub</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="text-xs h-7"
						>
							Connect
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* ── Danger zone ── */}
			<Card className="border-destructive/40">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium text-destructive">
						Danger zone
					</CardTitle>
					<p className="text-xs text-muted-foreground">
						These actions are permanent and cannot be undone.
					</p>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{/* Delete all PDFs */}
					<div className="flex items-center justify-between px-3 py-2.5 border rounded-lg">
						<div>
							<p className="text-sm font-medium">Delete all PDFs</p>
							<p className="text-xs text-muted-foreground">
								Remove all uploaded PDFs and their chats
							</p>
						</div>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/5"
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
					<div className="flex items-center justify-between px-3 py-2.5 border rounded-lg">
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
									className="text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/5"
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
}

function GoogleIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
		>
			<path
				fill="#4285F4"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			/>
			<path
				fill="#FBBC05"
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
			/>
		</svg>
	);
}

function GithubIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
		</svg>
	);
}
