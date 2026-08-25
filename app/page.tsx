import { DummyContent, NavbarDemo } from "@/components/landing/navbar";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
export default async function Page() {
	const session = await getServerSession();
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-rose-100 to-lime-100 dark:from-olive-950 dark:to-olive-700 relative">
			<NavbarDemo />
			<main className="flex flex-col items-center justify-center gap-2 mt-48">
				<h1
					className={cn(
						"lg:text-6xl text-5xl",
						"font-bold tracking-tight bg-linear-to-br dark:bg-linear-to-br from-lime-800 to-rose-800 dark:from-olive-200 dark:to-olive-400 bg-clip-text text-transparent font-inter",
					)}
				>
					Chat with any PDF
				</h1>

				<p className="max-w-xl my-4 lg:text-xl text-lg text-neutral-600 dark:text-neutral-300 text-center">
					Join millions of students, researchers and professionals to instantly
					answer questions and understand research with AI
				</p>

				<Link href="/signup">
					<button className="rounded-full dark:bg-lime-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-lime-600 active:scale-98 bg-lime-700 dark:hover:bg-lime-700 duration-200 ease-in-out">
						<span className="flex items-center gap-2">
							Get Started
							<ArrowRight
								strokeWidth={2.5}
								className="ml-1 size-4 animate-[bounceX_1.5s_infinite]"
							/>
						</span>
					</button>
				</Link>
			</main>
			<section>
				<DummyContent />
			</section>
		</div>
	);
}
