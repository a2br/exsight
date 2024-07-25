import Image from "next/image";
import styles from "./page.module.css";
import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
	const sesh = await auth();
	return (
		<main>
			<p>wassup baby girl</p>
			<form
				action={async () => {
					"use server";
					await signIn("google");
				}}
			>
				<button type="submit">Sign in with Google</button>
			</form>
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
