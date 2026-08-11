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
	TableCaption,
	TableCell,
	TableFooter,
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
import { api } from "@/trpc/client";

export const commonDotStyles =
	"absolute w-1 h-1 rounded-full bg-neutral-600 dark:bg-neutral-400 animate-pulse";

export default function BillingPage() {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const { data: invoices = [], isLoading: invoicesLoading } =
		api.subscription.getInvoices.useQuery();

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
				<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
					<span className={cn("-top-0.5 -left-0.5", commonDotStyles)}></span>
					<span className={cn("-top-0.5 -right-0.5", commonDotStyles)}></span>
					<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)}></span>
					<span
						className={cn("-bottom-0.5 -right-0.5", commonDotStyles)}
					></span>
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
				</div>
				{/* Plans */}
				<PricingCards
					loading={loading}
					setLoading={setLoading}
				/>

				{/* Invoice history */}
				<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
					<span className={cn("-top-0.5 -left-0.5", commonDotStyles)}></span>
					<span className={cn("-top-0.5 -right-0.5", commonDotStyles)}></span>
					<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)}></span>
					<span
						className={cn("-bottom-0.5 -right-0.5", commonDotStyles)}
					></span>
					<div>
						<h2 className="text-sm font-medium mb-3">Invoice history</h2>
						<Card>
							<Table>
								<TableCaption>A list of your recent invoices.</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead className="w-25">Invoice</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Method</TableHead>
										<TableHead className="text-right">Amount</TableHead>
										<TableHead className="text-right">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{invoicesLoading ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center py-8"
											>
												Loading invoices...
											</TableCell>
										</TableRow>
									) : invoices.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center py-8 text-muted-foreground"
											>
												No invoices yet
											</TableCell>
										</TableRow>
									) : (
										invoices.map((invoice) => (
											<TableRow key={invoice.id}>
												<TableCell className="font-medium">
													{invoice.invoice}
												</TableCell>
												<TableCell>{invoice.date}</TableCell>
												<TableCell>
													<Badge
														variant={
															invoice.paymentStatus === "Paid"
																? "default"
																: "secondary"
														}
													>
														{invoice.paymentStatus}
													</Badge>
												</TableCell>
												<TableCell>{invoice.paymentMethod}</TableCell>
												<TableCell className="text-right">
													{invoice.totalAmount}
												</TableCell>
												<TableCell className="text-right">
													{invoice.pdfUrl && (
														<a
															href={invoice.pdfUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="text-primary hover:underline flex items-center gap-1 justify-end"
														>
															<Download className="w-4 h-4" />
														</a>
													)}
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
								<TableFooter>
									<TableRow>
										<TableCell colSpan={4}>Total</TableCell>
										<TableCell className="text-right">
											₹
											{invoices
												.reduce((sum, inv) => {
													const amount = parseFloat(
														inv.totalAmount.replace("₹", ""),
													);
													return sum + (isNaN(amount) ? 0 : amount);
												}, 0)
												.toFixed(2)}
										</TableCell>
										<TableCell />
									</TableRow>
								</TableFooter>
							</Table>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
