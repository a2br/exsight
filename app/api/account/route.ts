import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteUser, getAuthedUser, refreshPredictions } from "@/lib/database";
import { auth } from "@/auth";
import { sections } from "@/lib/epfl";
import { Section, Year } from "@prisma/client";
import { z } from "zod";

// Get currently logged in account
export async function GET() {
	let self = await auth();
	let account = await getAuthedUser();
	// if (!account)
	// 	return NextResponse.json({ error: "Not logged in" }, { status: 401 });

	return NextResponse.json({ auth: self, account });
}

// Register account
export async function POST(request: NextRequest) {
	// If not authed, return error
	let them = await auth();
	if (!them)
		return NextResponse.json({ error: "Not logged in" }, { status: 401 });

	// If already registered, return error
	let account = await getAuthedUser();
	if (account)
		return NextResponse.json({ error: "Already registered" }, { status: 400 });
	var body = await request.json();
	// Expecting: section (string), year (2 or 3), gpa (number), fail (boolean)

	let parser = z
		.object({
			section: z.string().toUpperCase(),
			year: z.number().optional().default(2),
			gpa: z.number().gt(1).lte(6),
			fail: z.boolean(),
		})
		.safeParse(body);

	if (!parser.success)
		return NextResponse.json({ error: "Invalid fields" }, { status: 400 });

	let { section, year, gpa, fail } = parser.data;

	if (!sections.includes(section as any))
		return NextResponse.json({ error: "Invalid section" }, { status: 400 });

	if (![2, 3].includes(year))
		return NextResponse.json({ error: "Invalid year" }, { status: 400 });

	// Create user
	let user = await prisma.user.create({
		data: {
			name: them.user!.name!,
			email: them.user!.email!,
			image: them.user!.image!,

			firstName: (them.user! as any).firstName!,
			lastName: (them.user! as any).lastName!,

			section: section as Section,
			year: year == 3 ? Year.third : Year.second,
			gpa: gpa,
			fail,
		},
	});

	return NextResponse.json({ user });
}

// Update list of preferences
export async function PATCH(request: NextRequest) {
	// If not authed, return error
	let them = await auth();
	if (!them)
		return NextResponse.json({ error: "Not logged in" }, { status: 401 });

	// If already registered, return error
	let account = await prisma.user.findUnique({
		where: { email: them.user!.email! },
	});

	if (!account)
		return NextResponse.json({ error: "Not registered" }, { status: 401 });

	// Parse body
	let body = await request.json();

	let parser = z
		.object({
			agreements: z.array(z.string()).optional(),
		})
		.safeParse(body);

	if (!parser.success)
		return NextResponse.json({ error: "Invalid fields" }, { status: 400 });

	let { agreements } = parser.data;

	if (agreements !== undefined) {
		let docs = await Promise.all(
			agreements.map((id) =>
				prisma.agreement.findUnique({
					where: { id },
					include: { uni: true },
				})
			)
		);

		// If one of the agreements doesn't exist, return error
		if (docs.some((a) => !a))
			return NextResponse.json(
				{ error: "Invalid agreements" },
				{ status: 400 }
			);

		// Check that user indeed has access to all agreements
		if (docs.some((a) => !a!.sections.includes(account.section)))
			return NextResponse.json(
				{ error: "Some agreements are out of reach" },
				{ status: 400 }
			);

		// If use doesn't have access to world exchanges && there's some, return error
		if (account.gpa < 5 && docs.some((a) => a!.uni.regionCode !== "EUR"))
			return NextResponse.json(
				{ error: "Agreements outside Europe" },
				{ status: 400 }
			);

		// Check that each agreement group is under 6 long
		if (
			docs.filter((a) => a!.uni.overseas).length > 6 ||
			docs.filter((a) => !a!.uni.overseas).length > 6
		)
			return NextResponse.json(
				{ error: "Too many agreements" },
				{ status: 400 }
			);
		// Overseas first
		docs = docs.sort(
			(a, b) => Number(b!.uni.overseas) - Number(a!.uni.overseas)
		);

		// Everything seems good, update user
		await prisma.user.update({
			where: { id: account.id },
			data: {
				agreements: {
					set: docs
						// Overseas first
						.map((a) => ({ id: a!.id })),
				},
				agreementOrder: docs.map((a) => a!.id),
			},
		});

		refreshPredictions();
	}

	return NextResponse.json({ success: true });
}

// Delete account
export async function DELETE(request: NextRequest) {
	let user = await getAuthedUser();
	if (!user)
		return NextResponse.json({ error: "Not registered" }, { status: 401 });

	await deleteUser(user.id);
	refreshPredictions();

	return NextResponse.json({ success: true });
}
