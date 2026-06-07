import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function Page() {
	const session = getServerSession();
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-rose-100 to-teal-100">
			<h1 className="text-5xl font-bold tracking-tight">Chat with any PDF</h1>
			<p className="max-w-xl mt-4 text-lg text-neutral-600 text-center">
				Join millions of students, researchers and professionals to instantly
				answer questions and understand research with AI
			</p>
			<Link href="/login">
				<Button
					size="lg"
					className="bg-linear-to-r from-lime-500 to-emerald-500 mt-2 px-6 py-4"
				>
					Login to get Started!
					<LogIn className="w-4 h-4 ml-2" />
				</Button>
			</Link>
		</div>
	);
}
