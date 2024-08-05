import { auth } from "@/auth";
import { Footnote } from "@/components/ui/Footnote";
import { Header } from "@/components/ui/Header";
import { MyPicks } from "@/components/ui/MyPicks";
import { Walkthrough } from "@/components/ui/Walkthrough";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import "./page.module.css";

export default async function Home() {
	const sesh = await auth();
	if (!sesh) redirect("/login");
	const user =
		sesh?.user?.email &&
		(await prisma.user.findUnique({
			where: { email: sesh.user.email },
			include: { agreements: { include: { uni: true } } },
		}));
	if (!user) redirect("/register");

	return (
		<>
			<Header />
			<main>
				<MyPicks user={user} />
				<Walkthrough />
				<Footnote />
			</main>
		</>
	);
}
