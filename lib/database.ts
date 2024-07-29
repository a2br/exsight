import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { User } from "@prisma/client";

export async function getAuthedUser(): Promise<User | null> {
	let them = await auth();
	// Find user in database
	let user = them?.user?.email
		? await prisma.user.findUnique({
				where: {
					email: them.user.email,
				},
		  })
		: null;
	return user;
}

export async function syncEmulatedRankings() {
	// Get all the users, sorted by GPA
	// Store all agreements in an array, with the number of the latest rank
	// For each user, increment the rank and store it

	let users = await prisma.user.findMany({
		orderBy: {
			fail: "asc", // 0, then 1: non failing first, failing last
			gpa: "desc", // best, then worst
		},
		select: {
			id: true,
			agreements: {
				select: {
					id: true,
					places: true,
					uni: {
						select: {
							overseas: true,
						},
					},
				},
			},
		},
	});

	let rankings = new Map<string, { places: number; cursor: number }>();

	let pairings: { [key: string]: number[] } = {};

	for (let user of users) {
		var fulfilled = false;
		let leeway: number[] = [];
		// Suppose the user has the right for each agreement
		for (let option of user.agreements) {
			// Initialize agreement if not previously seen
			if (!rankings.has(option.id)) {
				rankings.set(option.id, {
					places: option.places,
					cursor: 0,
				});
			}

			// Get the ranking
			let { places, cursor } = rankings.get(option.id)!;

			// At this point: current user has the priority
			let placesLeft = places - cursor;
			let placesLeftAfterMe = placesLeft - 1;
			leeway.push(placesLeftAfterMe);

			// Take the next place
			if (!fulfilled) rankings.set(option.id, { places, cursor: cursor + 1 });

			if (placesLeft > 0) {
				fulfilled = true;
			}
		}

		pairings[user.id] = leeway;
	}

	return Promise.all(
		Object.keys(pairings).map((id) =>
			prisma.user.update({
				where: { id },
				data: {
					leeway: pairings[id],
				},
			})
		)
	);
}
