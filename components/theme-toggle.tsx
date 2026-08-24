"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { IconBrightness } from "@tabler/icons-react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			variant="ghost"
			size="icon-lg"
			aria-label="Toggle theme"
		>
			<IconBrightness size={24}/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
