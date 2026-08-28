"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type ChatLike = { updatedAt: string | Date; createdAt?: string | Date };
type DocLike = { createdAt: string | Date };

const chartConfig = {
	documents: {
		label: "Documents",
		color: "var(--chart-1)",
	},
	chats: {
		label: "Chats",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

function getLastNMonths(n: number) {
	const months: { year: number; month: number; label: string }[] = [];
	const now = new Date();
	for (let i = n - 1; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		months.push({
			year: d.getFullYear(),
			month: d.getMonth(),
			label: d.toLocaleDateString("en-US", { month: "short" }),
		});
	}
	return months;
}

export default function DashboardActivityChart({
	chats,
	docs,
}: {
	chats?: ChatLike[];
	docs?: DocLike[];
}) {
	const data = useMemo(() => {
		const months = getLastNMonths(6);

		return months.map(({ year, month, label }) => {
			const documents =
				docs?.filter((d) => {
					const date = new Date(d.createdAt);
					return (
						date.getFullYear() === year && date.getMonth() === month
					);
				}).length ?? 0;
			const chatCount =
				chats?.filter((c) => {
					const date = new Date(c.createdAt ?? c.updatedAt);
					return (
						date.getFullYear() === year && date.getMonth() === month
					);
				}).length ?? 0;

			return { month: label, documents, chats: chatCount };
		});
	}, [chats, docs]);

	const hasActivity = data.some((d) => d.documents > 0 || d.chats > 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base font-medium">
					Activity, last 6 months
				</CardTitle>
				<CardDescription>Documents uploaded and chats started</CardDescription>
			</CardHeader>
			<CardContent>
				{hasActivity ? (
					<ChartContainer
						config={chartConfig}
						className="h-56 w-full"
					>
						<BarChart
							data={data}
							barGap={4}
						>
							<CartesianGrid
								vertical={false}
								stroke="var(--border)"
							/>
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								className="text-xs"
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar
								dataKey="documents"
								fill="var(--color-documents)"
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="chats"
								fill="var(--color-chats)"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ChartContainer>
				) : (
					<div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
						No activity in the last 6 months
					</div>
				)}
			</CardContent>
		</Card>
	);
}
