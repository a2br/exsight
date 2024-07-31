import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { University, User } from "@prisma/client";

import { Section, sections } from "@/lib/epfl";

// Get all schools/agreements
export async function GET(req: NextRequest) {
	// get query params
	let url = new URL(req.url);
	let params = url.searchParams;

	let section = params.get("s")?.toUpperCase();
	let region = params.get("r")?.toUpperCase();
	let search = params.get("q");

	// Parse sections, which are comma-separated
	var sections = section ? (section.split(",") as Section[]) : [];
	// Check that they're valid
	if (sections.some((s) => !sections.includes(s)))
		return NextResponse.json({ error: "Invalid section" }, { status: 400 });

	// Remove duplicates
	sections = [...new Set(sections)];

	if (region && !["EUR", "WOR"].includes(region))
		return NextResponse.json({ error: "Invalid region" }, { status: 400 });

	//TODO Find corresponding universities
	let unis = await prisma.university.findMany({
		where: {
			AND: [
				// Section query
				{
					agreements: {
						some: {
							sections: {
								hasSome: sections,
							},
						},
					},
				},
				// Region query
				region
					? region === "EUR"
						? { region }
						: { region: { not: "EUR" } }
					: {},
				search && search.length > 3
					? {
							OR: [
								{ name: { contains: search } },
								{ town: { contains: search } },
								{ country: { contains: search } },
								{ url: { contains: search } },
							],
					  }
					: {},
			],
		},
	});

	return NextResponse.json({ universities: unis });
}
