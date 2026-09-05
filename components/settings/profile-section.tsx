import React from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/client";
import { useRefetch } from "@/hooks/use-refetch";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { IconCheck, IconLoader } from "@tabler/icons-react";
function getInitials(firstName?: string | null, lastName?: string | null) {
	return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

const ProfileSection = () => {
	const { data: session } = useSession();
	const user = session?.user;
	const { data: profile } = api.user.getProfile.useQuery();
	const refetch = useRefetch();
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
	function handleSaveProfile() {
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
				setTimeout(() => {
					updateProfile.reset();
				}, 2000);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
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
				<CardTitle className="text-base font-medium">Profile</CardTitle>
				<CardDescription>
					Manage your personal information and profile picture
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col items-start justify-center gap-4">
				{/* Avatar */}
				<div className="flex items-center gap-4">
					<Avatar className="w-16 h-16">
						<AvatarImage
							src={
								userAvatar.trim() !== ""
									? userAvatar
									: (user?.avatar ?? undefined)
							}
						/>
						<AvatarFallback className="text-lg">
							{getInitials(firstName, lastName)}
						</AvatarFallback>
					</Avatar>

					<div>
						<p className="text-sm font-medium">
							{profile?.firstName} {profile?.lastName}{" "}
							{!profile?.firstName && !profile?.lastName && user?.name}
						</p>

						<p className="text-xs text-muted-foreground mb-2">{user?.email}</p>

						<Button
							variant="secondary"
							size="sm"
							className="text-xs h-7 relative"
						>
							<input
								type="file"
								accept="image/*"
								className="inset-0 absolute opacity-0 cursor-pointer"
								onChange={(e) => {
									const file = e.target.files?.[0];

									if (file) {
										setUserAvatarFile(file);
										setUserAvatar(URL.createObjectURL(file));
									}
								}}
							/>
							Change avatar
						</Button>
					</div>
				</div>

				{/* Name */}
				<div className="grid sm:grid-cols-2 grid-cols-1 gap-4 w-full">
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
					<Button
						onClick={handleSaveProfile}
						disabled={updateProfile.isPending || updateProfile.isSuccess}
						className="w-32 relative overflow-hidden transition-none"
					>
						<AnimatePresence
							initial={false}
							mode="wait"
						>
							{updateProfile.isSuccess ? (
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
										Saved
									</motion.span>
								</motion.div>
							) : updateProfile.isPending ? (
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
									<span>Saving...</span>
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
									<span>Save changes</span>
								</motion.div>
							)}
						</AnimatePresence>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default ProfileSection;
