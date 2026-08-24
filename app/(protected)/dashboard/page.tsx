"use client";

import DashboardChats from "@/components/dash/dashboard-chats";
import DashboardPdfs from "@/components/dash/dashboard-pdfs";
import DashboardActivityChart from "@/components/dash/activity-chart";
import { api } from "@/trpc/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { AlertCircle, FileText, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const DashboardPage = () => {
	const { data: docs } = api.pdf.getUserPdfs.useQuery();
	const { data: chats } = api.chat.getChats.useQuery();
	const { data: quota } = api.pdf.getUploadQuota.useQuery();
	const { data: session } = useSession();
	const user = session?.user;

	const lastActive = chats?.[0]?.updatedAt
		? new Date(chats[0].updatedAt).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "—";

	const getDashboardGreeting = () => {
		const hour = new Date().getHours();

		let greetings: string[];

		if (hour >= 5 && hour < 12) {
			greetings = ["Morning", "Already up", "Up early", "What's up"];
		} else if (hour >= 12 && hour < 17) {
			greetings = ["Good afternoon", "Afternoon", "Lunch done", "What's up"];
		} else if (hour >= 17 && hour < 22) {
			greetings = ["Good evening", "Evening", "Tea time", "What's up"];
		} else {
			greetings = [
				"Still up",
				"Late night session",
				"Working late",
				"What's up",
			];
		}

		const day = new Date().getDate();
		const period = Math.floor(hour / 4);
		const index = (day + period) % greetings.length;

		return `${greetings[index]}`;
	};

	return (
		<div className="bg-sidebar h-full overflow-auto">
			<div className="mx-auto px-6 py-8 flex flex-col gap-8">
				{/* Header */}
				<div>
					<h1 className="md:text-3xl text-2xl font-bold text-foreground">
						{getDashboardGreeting()},{" "}
						<span className="bg-linear-to-br from-lime-600 to-green-600 bg-clip-text text-transparent font-black">
							Dhruv!
						</span>
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Your documents and conversations at a glance
					</p>
				</div>

				{/* Upload quota alert for Hobby users */}
				{quota && !quota.canUpload && !quota.pro && (
					<Alert variant="destructive">
						<AlertCircle className="size-4" />
						<AlertTitle>Monthly limit reached</AlertTitle>
						<AlertDescription>
							You&apos;ve uploaded {quota.uploaded}/{quota.limit} PDFs.{" "}
							<Link
								href="/billings"
								className="underline font-semibold"
							>
								Upgrade to Pro
							</Link>
						</AlertDescription>
					</Alert>
				)}

				{quota && quota.canUpload && !quota.pro && (
					<Alert>
						<AlertCircle className="size-4" />
						<AlertTitle>Hobby plan</AlertTitle>
						<AlertDescription>
							{quota.uploaded}/{quota.limit} PDFs uploaded this month
						</AlertDescription>
					</Alert>
				)}

				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardDescription>Documents uploaded</CardDescription>
							<FileText className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-semibold tracking-tight">
								{docs?.length ?? 0}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardDescription>Total chats</CardDescription>
							<MessageSquare className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-semibold tracking-tight">
								{chats?.length ?? 0}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardDescription>Last active</CardDescription>
							<Clock className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-semibold tracking-tight">
								{lastActive}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Activity chart */}
				<DashboardActivityChart
					chats={chats}
					docs={docs}
				/>

				{/* Main panels */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<DashboardPdfs />
					<DashboardChats />
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
