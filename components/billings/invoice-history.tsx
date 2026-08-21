import React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { commonDotStyles } from "@/lib/styles";
import { Download } from "lucide-react";
import { api } from "@/trpc/client";

const InvoiceHistory = () => {
	const { data: invoices = [], isLoading: invoicesLoading } =
		api.subscription.getInvoices.useQuery();
	return (
		<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
			<span className={cn("-top-0.5 -left-0.5", commonDotStyles)}></span>
			<span className={cn("-top-0.5 -right-0.5", commonDotStyles)}></span>
			<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)}></span>
			<span className={cn("-bottom-0.5 -right-0.5", commonDotStyles)}></span>
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
	);
};

export default InvoiceHistory;
