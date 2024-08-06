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
	user.agreements = sortDocs(user.agreements, user.agreementOrder);

	// For each agreement, add an array of the grades of all candidates
	for (let agr of user.agreements) {
		(agr as any).candidates = (
			await prisma.user.findMany({
				where: { agreements: { some: { id: agr.id } } },
				select: { gpa: true },
			})
		)
			.map((u) => u.gpa)
			.sort((a, b) => b - a);
	}

	const newUser = {
		...user,
		agreements: await Promise.all(
			user.agreements.map(async (agr) => ({
				...agr,
				candidates: (
					await prisma.user.findMany({
						where: { agreements: { some: { id: agr.id } } },
						select: { gpa: true },
					})
				)
					.map((u) => u.gpa)
					.sort((a, b) => b - a),
			}))
		),
	};

	console.log(newUser.agreements);

	return NextResponse.json({
		user: newUser,
	});
}
