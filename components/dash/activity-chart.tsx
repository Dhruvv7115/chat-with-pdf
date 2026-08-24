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

function getLastNDays(n: number) {
	const days: { key: string; label: string }[] = [];
	for (let i = n - 1; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		days.push({
			key: d.toDateString(),
			label: d.toLocaleDateString("en-US", { weekday: "short" }),
		});
	}
	return days;
}

export default function DashboardActivityChart({
	chats,
	docs,
}: {
	chats?: ChatLike[];
	docs?: DocLike[];
}) {
	const data = useMemo(() => {
		const days = getLastNDays(7);

		return days.map(({ key, label }) => {
			const documents =
				docs?.filter((d) => new Date(d.createdAt).toDateString() === key)
					.length ?? 0;
			const chatCount =
				chats?.filter(
					(c) => new Date(c.createdAt ?? c.updatedAt).toDateString() === key,
				).length ?? 0;

			return { day: label, documents, chats: chatCount };
		});
	}, [chats, docs]);

	const hasActivity = data.some((d) => d.documents > 0 || d.chats > 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base font-medium">
					Activity, last 7 days
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
								dataKey="day"
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
						No activity in the last 7 days
					</div>
				)}
			</CardContent>
		</Card>
	);
}
