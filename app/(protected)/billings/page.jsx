"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	CheckCircle2,
	CreditCard,
	Download,
	FileText,
	Sparkles,
	Zap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import PricingCards from "./pricing-cards";

const INVOICES = [
	{ id: "INV-0005", date: "May 1, 2026", amount: "$12.00", status: "Paid" },
	{ id: "INV-0004", date: "Apr 1, 2026", amount: "$12.00", status: "Paid" },
	{ id: "INV-0003", date: "Mar 1, 2026", amount: "$12.00", status: "Paid" },
	{ id: "INV-0002", date: "Feb 1, 2026", amount: "$12.00", status: "Paid" },
	{ id: "INV-0001", date: "Jan 1, 2026", amount: "$12.00", status: "Paid" },
];


export default function BillingPage() {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	console.log(searchParams.get("success"));

	useEffect(() => {
		if (searchParams.get("success")) {
			toast.success("You're now on the Pro plan!");
		}
		if (searchParams.get("canceled")) {
			toast.error("Payment canceled.");
		}
	}, [searchParams]);

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto px-6 py-8 space-y-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-accent-foreground">
						Billings
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your plan and payment details
					</p>
				</div>

				{/* Current plan summary */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base font-medium">
							Current plan
						</CardTitle>
						<CardDescription>You are on the Free plan</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
									<Zap className="w-4 h-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">Free</p>
									<p className="text-xs text-muted-foreground">
										5 PDF + 50 messages / month
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-sm font-medium">$0.00 / month</p>
								<Badge
									variant="secondary"
									className="text-xs mt-1"
								>
									Active
								</Badge>
							</div>
						</div>

						<Separator />

						<div className="flex items-center gap-3">
							<CreditCard className="w-4 h-4 text-muted-foreground" />
							<p className="text-sm text-muted-foreground">
								Visa ending in{" "}
								<span className="font-medium text-foreground">4242</span>
							</p>
							<Button
								variant="ghost"
								size="sm"
								className="ml-auto h-7 text-xs"
							>
								Update card
							</Button>
						</div>

						<div className="flex gap-2 pt-1">
							<Button
								variant="outline"
								size="sm"
							>
								Cancel plan
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Plans */}
				<PricingCards loading={loading} setLoading={setLoading} />

				{/* Invoice history */}
				<div>
					<h2 className="text-sm font-medium mb-3">Invoice history</h2>
					<Card>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-xs">Invoice</TableHead>
									<TableHead className="text-xs">Date</TableHead>
									<TableHead className="text-xs">Amount</TableHead>
									<TableHead className="text-xs">Status</TableHead>
									<TableHead className="text-xs text-right">Download</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{INVOICES.map((inv) => (
									<TableRow key={inv.id}>
										<TableCell className="text-sm font-medium">
											{inv.id}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{inv.date}
										</TableCell>
										<TableCell className="text-sm">{inv.amount}</TableCell>
										<TableCell>
											<Badge
												variant="secondary"
												className="text-xs"
											>
												{inv.status}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7"
											>
												<Download className="w-3.5 h-3.5" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</div>
			</div>
		</div>
	);
}
