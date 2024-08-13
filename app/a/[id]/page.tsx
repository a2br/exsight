import { auth } from "@/auth";
import { AgreementViewer } from "@/components/ui/AgreementViewer";
import { Header } from "@/components/ui/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface Params {
	params: {
		id: string;
	};
	searchParams: {
		to?: string;
	};
}

export default async function Agreement({
	params: { id },
	searchParams: { to },
}: Params) {
	const sesh = await auth();
	if (!sesh) redirect("/login");
	const user = await prisma.user.findUnique({
		where: { email: sesh!.user!.email! },
		include: {
			agreements: { include: { uni: true } },
		},
	});
	if (!user) redirect("/register");

	const agreement = await prisma.agreement.findUnique({
		where: { id },
		include: { uni: true },
	});
	let candidates = await prisma.user.findMany({
		where: { agreementOrder: { has: id } },
		select: { gpa: true, fail: true },
		orderBy: [{ fail: "asc" }, { gpa: "desc" }],
	});

	let idx = to && parseInt(to);
	if (idx === "" || (idx !== undefined && idx < 0)) idx = undefined;

	return (
		<>
			<Header />
			<main style={{ margin: "2em" }}>
				{agreement ? (
					<AgreementViewer
						user={JSON.parse(JSON.stringify(user))}
						agreement={
							JSON.parse(JSON.stringify({ ...agreement, candidates })) as any
						}
						idx={idx}
					/>
				) : (
					"Agreement not found"
				)}
			</main>
		</>
	);
}
