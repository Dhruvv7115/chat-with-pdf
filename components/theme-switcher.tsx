import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import React from "react";
type ThemeType = "system" | "light" | "dark";
const themes: {
	name: ThemeType;
	icon: React.ForwardRefExoticComponent<any>;
}[] = [
	{ name: "system", icon: IconDeviceDesktop },
	{ name: "light", icon: IconSun },
	{ name: "dark", icon: IconMoon },
];
const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div className="dark:bg-neutral-950 bg-neutral-50 dark:text-white text-black flex items-center justify-center rounded-full p-1">
			{themes.map((t) => (
				<div
					key={t.name}
					onClick={() => setTheme(t.name)}
					className="p-1.5 relative z-10 cursor-pointer"
				>
					<t.icon
						strokeWidth={1}
						className="size-5"
					/>
					{theme === t.name && (
						<motion.div
							layoutId="theme-group"
							className="absolute inset-0 bg-muted dark:bg-neutral-900 w-full rounded-full -z-10 border border:border-neutral-200  dark:border-neutral-800"
						/>
					)}
				</div>
			))}
		</div>
	);
};

export default ThemeSwitcher;
