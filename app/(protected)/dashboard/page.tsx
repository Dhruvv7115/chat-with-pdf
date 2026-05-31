"use client";

import DashboardChats from "@/components/dashboard-chats";
import DashboardPdfs from "@/components/dashboard-pdfs";
import { api } from "@/trpc/client";

const DashboardPage = () => {
	const { data: pdfs } = api.pdf.getUserPdfs.useQuery();
	const { data: chats } = api.chat.getChats.useQuery();

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
