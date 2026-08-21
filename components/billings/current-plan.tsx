import React from "react";
import { Button } from "../ui/button";
import { CreditCard, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { commonDotStyles } from "@/lib/styles";
import { Separator } from "../ui/separator";
import { api } from "@/trpc/client";

const CurrentPlan = () => {
	const { data: currentPlan } = api.subscription.getCurrentPlan.useQuery();
	return (
		<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
			<span className={cn("-top-0.5 -left-0.5", commonDotStyles)}></span>
			<span className={cn("-top-0.5 -right-0.5", commonDotStyles)}></span>
			<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)}></span>
			<span className={cn("-bottom-0.5 -right-0.5", commonDotStyles)}></span>
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-medium">Current plan</CardTitle>
					<CardDescription>
						{currentPlan && `You are on the ${currentPlan} plan`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
								<Zap className="w-4 h-4 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium">{currentPlan ?? ""}</p>
								<p className="text-xs text-muted-foreground">
									{currentPlan === "Free"
										? `5 Docs + 50 messages / month`
										: `Unlimited Docs + messages / month`}
								</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm font-medium">
								{currentPlan === "Free" ? "₹0/month" : "₹1000/month"}
							</p>
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
	);
};

export default CurrentPlan;
