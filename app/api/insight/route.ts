import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sortDocs } from "@/lib/util";

// Basically the starting point of the UI.
// 1. Information about the selected exchanges
// 2. Information about starred exchanges

export async function GET() {
	let them = await auth();
	if (!them)
		return NextResponse.json({ error: "Not logged in" }, { status: 401 });
	let user = await prisma.user.findUnique({
		where: { email: them.user!.email! },
		include: { agreements: { include: { uni: true } } },
	});
	if (!user)
		return NextResponse.json({ error: "Not registered" }, { status: 400 });
	// Goal of Insights: return user and their agreements in the correct order
	let sortedAgreements = sortDocs(user.agreements, user.agreementOrder);

	let boostedAgreements = await Promise.all(
		sortedAgreements.map(async (agr) => {
			let candidates = await prisma.user.findMany({
				where: { agreements: { some: { id: agr.id } } },
				select: { gpa: true, fail: true },
				orderBy: [
					{
						fail: "asc",
					},
					{
						gpa: "desc",
					},
				],
			});

			return {
				...agr,
				candidates: candidates.map((u) => ({
					fail: u.fail,
					gpa: Math.round(u.gpa * 100) / 100,
				})),
			};
		})
	);

	const userWithCandidates = {
		...user,
		agreements: boostedAgreements,
	};

	return NextResponse.json({
		user: userWithCandidates,
	});
}
