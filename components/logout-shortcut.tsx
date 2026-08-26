"use client";

import { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";
import { signOut } from "next-auth/react";
import { IconLoader } from "@tabler/icons-react";

export default function LogoutShortcut() {
	const [open, setOpen] = useState<boolean>(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isModifier = e.metaKey || e.ctrlKey;
			if (isModifier && e.shiftKey && e.key.toLowerCase() === "l") {
				e.preventDefault();
				setOpen(true);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	async function handleLogout(e: React.MouseEvent) {
		e.preventDefault();
		setIsLoggingOut(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		await signOut({ callbackUrl: "/" });
	}

	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => !isLoggingOut && setOpen(next)}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Log out?</AlertDialogTitle>
					<AlertDialogDescription>
						You&apos;ll need to sign in again to access your documents and
						chats.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={isLoggingOut}
						onClick={handleLogout}
					>
						{isLoggingOut ? (
							<>
								<IconLoader className="w-4 h-4 mr-2 animate-spin" />
								Logging out...
							</>
						) : (
							"Log out"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
