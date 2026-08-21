import "./globals.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Literata, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const literata = Literata({
	subsets: ["latin"],
	variable: "--font-literata",
});

const jetBrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
});

const geistSans = Geist({
	variable: "--font-geist",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ChatWithPDF",
	description: "Chat with your documents in seconds, powered by Gemini AI.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${literata.variable} ${jetBrainsMono.variable} ${inter.variable} antialiased`}
			>
				<Toaster
					richColors
					position="top-center"
					toastOptions={{
						duration: 3000,
					}}
				/>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
