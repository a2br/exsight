import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
	const sesh = await auth();
	if (!sesh) redirect("/login");
	return (
		<main>
			<h1>ExSight</h1>
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit">Sign out</button>
			</form>

			<code>
				<pre>{JSON.stringify(sesh, null, 2)}</pre>
			</code>
		</main>
	);
}
