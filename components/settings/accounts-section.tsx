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
import Image from "next/image";
import { Badge } from "../ui/badge";

const AccountsSection = () => {
	return (
		<Card
			className={cn(
				"flex flex-col h-full rounded-3xl p-2",
				"border border-neutral-100 dark:border-neutral-800",
				"bg-white dark:bg-neutral-900",
			)}
		>
			<CardHeader className="rounded-xl bg-neutral-200 dark:bg-neutral-800 py-4">
				<CardTitle className="text-base font-medium">
					Connected accounts
				</CardTitle>

				<CardDescription>
					Manage the accounts connected to your account
				</CardDescription>
			</CardHeader>

			<CardContent className="w-full flex flex-col items-center justify-center lg:p-2 p-0 gap-2">
				{/* Google */}
				<div className="flex items-center justify-between rounded-lg px-4 py-3 w-full bg-muted border-0">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center">
							<Image
								src="https://thesvg.org/icons/google/default.svg"
								alt="Google"
								width={24}
								height={24}
							/>
						</div>

						<div>
							<p className="text-sm font-medium">Google</p>

							<p className="text-xs text-muted-foreground">Connected account</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Badge>
							Connected
						</Badge>
						

						<Button
							variant="destructive"
							size="sm"
						>
							Disconnect
						</Button>
					</div>
				</div>

				{/* GitHub */}
				<div className="flex items-center justify-between rounded-lg px-4 py-3 w-full bg-muted border-0">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center">
							<Image
								src="https://thesvg.org/icons/github/light.svg"
								alt="GitHub"
								width={24}
								height={24}
								className="dark:hidden block"
							/>
							<Image
								src="https://thesvg.org/icons/github/dark.svg"
								alt="GitHub"
								width={24}
								height={24}
								className="dark:block hidden"
							/>
						</div>

						<div>
							<p className="text-sm font-medium">GitHub</p>

							<p className="text-xs text-muted-foreground">
								Connect your GitHub account
							</p>
						</div>
					</div>

					<Button
						size="sm"
					>
						Connect
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AccountsSection;
