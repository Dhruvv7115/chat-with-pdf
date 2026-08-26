"use client";
import { useState } from "react";
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
	CardTitle,
} from "@/components/ui/card";
import {
	IconAlertCircle as AlertCircle,
	IconFileText as FileText,
	IconMessage as Message,
	IconClock as Clock,
	IconArrowUpRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

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
					<StatCard
						title="Documents uploaded"
						value={docs?.length.toString() ?? "0"}
						href="/docs"
						icon={<FileText className="size-6 text-muted-foreground" />}
					/>
					<StatCard
						title="Total chats"
						href="/chats"
						value={chats?.length.toString() ?? "0"}
						icon={<Message className="size-6 text-muted-foreground" />}
					/>
					<StatCard
						title="Last active"
						value={lastActive}
						icon={<Clock className="size-6 text-muted-foreground" />}
					/>
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

interface StatCardProps {
	title: string;
	value: string;
	href?: string;
	icon: React.ReactNode;
}

function StatCard({ title, value, icon, href }: StatCardProps) {
	const [hovered, setHovered] = useState(false);
	return (
		<Card
			className={cn(
				"flex flex-col h-full rounded-3xl p-2",
				"border border-neutral-100 dark:border-neutral-800",
				"bg-neutral-200 dark:bg-neutral-800",
			)}
		>
			<CardHeader className="rounded-xl bg-white dark:bg-neutral-900 py-4">
				<CardContent
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					className="flex flex-row items-center justify-between space-y-0 pb-2 text-muted-foreground"
				>
					<CardDescription className="md:text-base text-sm font-semibold">
						{title}
					</CardDescription>
					<span>
						{!hovered || !href ? (
							icon
						) : (
							<Link
								href={href}
								className="hover:bg-muted"
							>
								<IconArrowUpRight />
							</Link>
						)}
					</span>
				</CardContent>
				<CardContent className="mt-3">
					<CardTitle className="text-2xl text-accent-foreground font-bold">
						{value}
					</CardTitle>
				</CardContent>
			</CardHeader>
		</Card>
	);
}

export default DashboardPage;
