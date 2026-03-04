"use client";
import { ComponentExample } from "@/components/component-example";
import { signOut, useSession } from "next-auth/react";

export default function Page() {
	const session = useSession();
	return (
		<div>
			<div>{JSON.stringify(session)}</div>
			<button onClick={() => signOut()}>Logout</button>
			<ComponentExample />
		</div>
	);
}
