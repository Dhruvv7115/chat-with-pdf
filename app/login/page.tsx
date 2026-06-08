"use client";
import { LoginForm } from "@/components/login-form";
import { GalleryVerticalEndIcon, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link
						href="/"
						className="flex items-center gap-2 font-semibold"
					>
						<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEndIcon className="size-4" />
						</div>
						ChatWithPDF
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:flex items-center justify-center bg-linear-to-br from-rose-100 to-emerald-100 bg-blend-color">
				<div className="flex flex-col items-center justify-center gap-4 md:justify-start max-w-xl">
					<Link
						href="/"
						className="flex items-center gap-4 font-bold text-[2.5rem]"
					>
						<div className="flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEndIcon className="size-8" />
						</div>
						<h1>ChatWithPDF</h1>
					</Link>
					<p className="mt-4 text-center text-sm font-light">
						Join millions of students, researchers and professionals to
						instantly answer questions and understand research with AI
					</p>
					<button
						className="bg-linear-to-br bg-blend-color from-lime-500 to-lime-700 mt-2 px-5 py-2 text-white rounded-xl text-base inline-flex items-center gap-2 hover:bg-linear-to-br hover:from-lime-700 hover:to-lime-500 transition-colors duration-300 ease-in-out cursor-pointer font-medium"
						onClick={() => router.push("/signup")}
					>
						Get Started Today
						<LogIn className="w-4 h-4 ml-2" />
					</button>
				</div>
			</div>
		</div>
	);
}
