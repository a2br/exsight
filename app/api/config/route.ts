import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import partners from "@/public/data/partners.json";

let specialCases = ["ENS-LYON.FR", "ENS.FR", "XPARIS.FR"];

export async function GET() {
	if (process.env.NODE_ENV !== "development")
		return new Response("nope", { status: 403 });

	// Read file public/data/partners.json
	// Parse the JSON

	// Generate unis and agreements
	// Remove all existing ones
	//TODO Find way to update them, probably.
	await prisma.agreement.deleteMany();
	await prisma.university.deleteMany();

	for (let uni of partners.file) {
		console.log("Processing", uni.school.acronym);
		// Create uni or update it if its code exists
		let university = await prisma.university.create({
			data: {
				code: uni.school.acronym,
				name: uni.school.name.fr,
				url: uni.school.url,
				town: uni.town.en,
				country: uni.country.name.en,
				countryCode: uni.country.code.toUpperCase(),
				region: uni.region.name.en,
				regionCode: uni.region.code.toUpperCase(),

				special: specialCases.includes(uni.school.acronym),
			},
		});

		for (let agreement of uni.accords) {
			if (agreement.sections.length === 0) continue;
			if (agreement.status.code !== "STAT_ACC_EN_COURS") continue;
			if (!agreement.isCurrent) continue;

			let totalPlaces = agreement.sections[0].placesOut;
			let sections = agreement.sections.map((s) => s.section.code.fr);

			let newAgreement = await prisma.agreement.create({
				data: {
					uni: { connect: { id: university.id } },
					sections: sections as any,
					places: totalPlaces,
				},
			});
		}
	}

	// Respond with text "ok"
	return new Response("ok");
}
