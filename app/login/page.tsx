"use client";
import { LoginForm } from "@/components/auth/login-form";
import { cn } from "@/lib/utils";
import { IconArrowRight } from "@tabler/icons-react";
import { GalleryVerticalEndIcon, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10 bg-neutral-100 dark:bg-olive-900/60">
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
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:flex items-center justify-center bg-linear-to-br from-rose-100 to-emerald-100 bg-blend-color">
				<div className="flex flex-col items-center justify-center gap-4 md:justify-start max-w-xl">
					<Link
						href="/"
						className="flex items-center gap-4 font-bold font-inter text-[2.5rem]"
					>
						<div className="flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEndIcon
								strokeWidth={1.5}
								className="size-8"
							/>
						</div>
						<h1>ChatWithPDF</h1>
					</Link>
					<p className="mt-4 text-center text-base">
						Join millions of students, researchers and professionals to
						instantly answer questions and understand research with AI
					</p>
					<button
						className={cn(
							"hover:bg-lime-700 bg-lime-600",
							"text-sm font-semibold text-white",
							"rounded-full px-6 py-3",
							"active:scale-95 cursor-pointer",
							"shadow-[inset_0px_0px_10px_0px_rgba(0,0,0,0.4)]",
							"transition-all duration-200 ease-in-out",
						)}
						onClick={() => router.push("/signup")}
					>
						<span className="flex items-center gap-2">
							Get Started
							<IconArrowRight
								strokeWidth={2.5}
								className="ml-1 size-4 animate-[bounceX_1.5s_infinite]"
							/>
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
