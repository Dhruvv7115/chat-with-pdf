import "./globals.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import {
	Geist,
	Geist_Mono,
	Inter,
	Instrument_Serif,
	Fira_Code,
} from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const firaCode = Fira_Code({
	variable: "--font-fira-code",
	subsets: ["latin"],
});

const geistSans = Geist({
	variable: "--font-geist",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
	variable: "--font-instrument-serif",
	weight: "400",
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
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${instrumentSerif.variable} ${firaCode.variable} antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
