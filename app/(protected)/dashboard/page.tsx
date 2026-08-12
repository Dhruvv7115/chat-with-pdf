"use client";

import DashboardChats from "@/components/dashboard-chats";
import DashboardPdfs from "@/components/dashboard-pdfs";
import { api } from "@/trpc/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
	const { data: pdfs } = api.pdf.getUserPdfs.useQuery();
	const { data: chats } = api.chat.getChats.useQuery();
	const { data: quota } = api.pdf.getUploadQuota.useQuery();

	const lastActive = chats?.[0]?.updatedAt
		? new Date(chats[0].updatedAt).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "—";

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Your documents and conversations at a glance
					</p>
				</div>

				{/* Upload quota alert for Hobby users */}
				
				{quota && !quota.canUpload && !quota.pro && (
					<Alert variant="destructive" className="mb-6">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							<span className="font-medium">Monthly limit reached.</span> You've uploaded {quota.uploaded}/{quota.limit} PDFs. 
							<Link href="/billings" className="underline font-semibold ml-1">
								Upgrade to Pro
							</Link>
						</AlertDescription>
					</Alert>
				)}

				{quota && quota.canUpload && !quota.pro && (
					<Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
						<AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
						<AlertDescription className="text-blue-800 dark:text-blue-200">
							<span className="font-medium">Hobby plan:</span> {quota.uploaded}/{quota.limit} PDFs uploaded this month
						</AlertDescription>
					</Alert>
				)}

				{/* Stats */}
				<div className="grid grid-cols-3 gap-3 mb-8">
					<div className="bg-muted/50 rounded-lg p-4">
						<p className="text-xs text-muted-foreground mb-1">PDFs uploaded</p>
						<p className="text-2xl font-medium">{pdfs?.length ?? 0}</p>
					</div>
					<div className="bg-muted/50 rounded-lg p-4">
						<p className="text-xs text-muted-foreground mb-1">Total chats</p>
						<p className="text-2xl font-medium">{chats?.length ?? 0}</p>
					</div>
					<div className="bg-muted/50 rounded-lg p-4">
						<p className="text-xs text-muted-foreground mb-1">Last active</p>
						<p className="text-base font-medium pt-1">{lastActive}</p>
					</div>
				</div>

				{/* Main panels */}
				<div className="grid grid-cols-2 gap-4">
					<DashboardPdfs />
					<DashboardChats />
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
