import { auth } from "@/auth";
import { AccountManager } from "@/components/ui/AccountManager";
import { Header } from "@/components/ui/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Settings() {
	const sesh = await auth();
	if (!sesh) redirect("/login");
	const user = await prisma.user.findUnique({
		where: { email: sesh!.user!.email! },
	});
	if (!user) redirect("/register");

	return (
		<>
			<Header />
			<main style={{ margin: "2em" }}>
				<h2>Settings</h2>
				<AccountManager user={user} />
			</main>
		</>
	);
}
