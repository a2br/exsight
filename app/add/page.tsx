import { auth } from "@/auth";
import { AgreementBrowser } from "@/components/ui/AgreementBrowser";
import { Header } from "@/components/ui/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface Params {
	params: {
		id: string;
	};
}

export default async function AddAgreement({ params: { id } }: Params) {
	const sesh = await auth();
	if (!sesh) redirect("/login");
	// Fetch user
	const user = await prisma.user.findUnique({
		where: { email: sesh.user!.email! },
		include: { agreements: { include: { uni: true } } },
	});
	if (!user) redirect("/register");

	return (
		<>
			<Header />
			<main>
				<AgreementBrowser user={user} agreements={[]} />
			</main>
		</>
	);
}
