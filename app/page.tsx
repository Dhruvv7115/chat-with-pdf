import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
export default async function Page() {
	const session = getServerSession();
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-rose-100 to-lime-100">
			<h1 className="text-5xl font-bold tracking-tight">Chat with any PDF</h1>
			<p className="max-w-xl mt-4 text-lg text-neutral-600 text-center">
				Join millions of students, researchers and professionals to instantly
				answer questions and understand research with AI
			</p>
			<Link href="/signup">
				<Button
					size="lg"
					className="bg-blend-color bg-linear-to-br from-teal-200 to-lime-500 mt-2 px-6 py-4 hover:from-lime-200 hover:to-teal-500 cursor-pointer"
				>
					Get Started Today
					<LogIn className="w-4 h-4 ml-2" />
				</Button>
			</Link>
		</div>
	);
}
