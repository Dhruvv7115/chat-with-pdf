"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { IconBrightness } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({
	className,
	variant = "outline",
}: {
	className?: string;
	variant?: "ghost" | "outline";
}) {
	const { theme, setTheme } = useTheme();
	return (
		<Button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			variant={variant}
			size={variant === "outline" ? "icon" : "icon-sm"}
			aria-label="Toggle theme"
			className={cn("rounded-full", className)}
		>
			<IconBrightness size={24} />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
