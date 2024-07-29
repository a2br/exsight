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

	let answer = await prisma.$runCommandRaw({
		aggregate: "University", // Use the 'aggregate' command on the 'University' collection
		pipeline: [
			{
				$match: {
					$text: search ? { $search: search } : undefined,
					regionCode: region
						? region === "EUR"
							? "EUR"
							: {
									$not: {
										$in: ["EUR"],
									},
							  }
						: undefined,
				},
			},
			{
				$lookup: {
					from: "Agreement",
					localField: "_id",
					foreignField: "universityId",
					as: "agreements",
					pipeline:
						sections.length > 0
							? [
									{
										$match: { sections: { $in: sections } },
									},
							  ]
							: undefined,
				},
			},
			{
				$match: { "agreements.0": { $exists: true } },
			},
		],
		cursor: {}, // Optional cursor configuration
	});

	if (!answer.ok)
		return NextResponse.json({ error: "Internal error" }, { status: 500 });

	let files: any[] = (answer.cursor! as any).firstBatch!;

	for (let f of files) {
		f.id = f._id.$oid;
		delete f._id;

		for (let a of f.agreements) {
			a.id = a._id.$oid;
			delete a._id;
			delete a.universityId;

			//TODO Enhance agreement with feedback (index, etc.)
			// What are the other grades (not counting you) => what position would you be in?
		}
	}

	return NextResponse.json(files);
}
