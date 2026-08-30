"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { cn } from "@/lib/utils";
import { GalleryVerticalEndIcon, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const router = useRouter();
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex gap-2 justify-start w-full mx-auto max-w-sm sm:max-w-full">
					<Link
						href="/"
						className="flex items-center gap-2 font-semibold"
					>
						<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEndIcon
								strokeWidth={1.5}
								className="size-4"
							/>
						</div>
						ChatWithPDF
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-sm">
						<SignupForm />
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
							<GalleryVerticalEndIcon
								strokeWidth={1.5}
								className="size-8"
							/>
						</div>
						<h1>ChatWithPDF</h1>
					</Link>
					<p className="mt-4 text-center text-sm font-light">
						Join millions of students, researchers and professionals to
						instantly answer questions and understand research with AI
					</p>
					<button
						className={cn(
							"dark:bg-neutral-900 hover:bg-black bg-neutral-900",
							"text-sm font-semibold text-white",
							"border border-transparent",
							"rounded-full px-6 py-3",
							"shadow-[inset_0px_1px_0px_0px_#FFFFFF40,inset_0px_-1px_0px_0px_#FFFFFF40]",
							"active:scale-95 cursor-pointer",
							"flex items-center justify-center",
							"transition duration-200 ease-in-out",
							"relative z-10",
						)}
						onClick={() => router.push("/login")}
					>
						Login to your account
						<LogIn className="w-4 h-4 ml-2" />
					</button>
				</div>
			</div>
		</div>
	);
}
