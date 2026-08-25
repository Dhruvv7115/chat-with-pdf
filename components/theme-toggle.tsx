"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { IconBrightness } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useNavbarVisible } from "./ui/resizable-navbar";

export function ThemeToggle({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const visible = useNavbarVisible();
	return (
		<Button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			variant="ghost"
			size="icon-lg"
			aria-label="Toggle theme"
			className={cn(visible ? "hidden" : "", className)}
		>
			<IconBrightness size={24} />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
