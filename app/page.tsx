import { auth } from "@/auth";
import { Footnote } from "@/components/ui/Footnote";
import { Header } from "@/components/ui/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import "./page.module.css";
import { MyAgreements } from "@/components/ui/MyAgreements";

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
				<MyAgreements user={JSON.parse(JSON.stringify(user))} />
				<Footnote />
			</main>
		</>
	);
}
