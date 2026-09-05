"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/trpc/client";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: ReactNode }) => {
	const { theme } = useTheme();

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<SessionProvider>
				<TRPCProvider>
					<SonnerToaster />
					{children}
				</TRPCProvider>
			</SessionProvider>
		</ThemeProvider>
	);
};
function SonnerToaster() {
	// Use resolvedTheme so it correctly handles "system" light/dark modes
	const { resolvedTheme } = useTheme();

	return (
		<Toaster
			theme={resolvedTheme as "dark" | "light" | "system"}
			position="top-center"
			toastOptions={{
				duration: 3000,
				unstyled: true,
				classNames: {
					//basic styles for all the toasts
					toast:
						"flex items-center gap-3 w-full max-w-sm p-4 rounded-xl shadow-lg border text-sm",
					title: "font-medium",
					description: "text-xs opacity-90",
					actionButton:
						"bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium",
					cancelButton:
						"bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-md text-xs font-medium",
					//different types of toasts
					default:
						"bg-white text-neutral-900 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-800",
					success:
						"bg-lime-50 text-lime-900 border-lime-200 dark:bg-lime-950 dark:text-lime-50 dark:border-lime-800",
					error:
						"bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950 dark:text-rose-50 dark:border-rose-800",
					info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-50 dark:border-blue-800",
					warning:
						"bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-50 dark:border-amber-800",
				},
			}}
		/>
	);
}
