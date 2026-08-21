import React from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/client";
import { useRefetch } from "@/hooks/use-refetch";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { commonDotStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
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
	return (
		<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
			<span className={cn("-top-0.5 -left-0.5", commonDotStyles)} />
			<span className={cn("-top-0.5 -right-0.5", commonDotStyles)} />
			<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)} />
			<span className={cn("-bottom-0.5 -right-0.5", commonDotStyles)} />

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-medium">Profile</CardTitle>
					<CardDescription>
						Manage your personal information and profile picture
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
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

					<Separator />

					{/* Name */}
					<div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
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
		</div>
	);
};

export default ProfileSection;
