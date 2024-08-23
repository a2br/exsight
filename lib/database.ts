import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { User } from "@prisma/client";
import { sortDocs } from "./util";

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

export async function deleteUser(id: string) {
	let user = await prisma.user.delete({
		where: {
			id,
		},
		include: {
			agreements: {
				include: {
					users: true,
				},
			},
		},
	});

	// Remove user ID from usersId
	for (let agreement of user.agreements) {
		await prisma.agreement.update({
			where: { id: agreement.id },
			data: {
				users: {
					disconnect: {
						id: user.id,
					},
				},
			},
		});
	}

	// Refresh predictions, later
}

// This is responsible for setting alpha indices
export async function refreshPredictions() {
	console.time("refreshPredictions");
	// Get all the users, sorted by GPA
	// Store all agreements in an array, with the number of the latest rank
	// For each user, increment the rank and store it

	console.time("- fetching users & agreements");

	let users = await prisma.user.findMany({
		where: {
			year: "second",
		},
		orderBy: [
			{
				fail: "asc", // 0, then 1: non failing first, failing last
			},
			{
				gpa: "desc", // best, then worst
			},
		],
		select: {
			id: true,
			gpa: true,
			fail: true,
			agreements: {
				select: {
					id: true,
					places: true,
				},
			},
			agreementOrder: true,
		},
	});

	// Populate with all agreements: important to clear out bad data
	let nonVirginAgreements = await prisma.agreement.findMany({
		select: {
			id: true,
			places: true,
		},
		where: {
			// In short: agreement isn't blank
			OR: [
				{
					// At least one user
					users: {
						some: {},
					},
				},
				{
					// No user, but not virgin
					failIdx: {
						not: -1,
					},
				},
				{
					// Non empty grades array
					grades: {
						isEmpty: false,
					},
				},
			],
		},
	});

	console.timeEnd("- fetching users & agreements");
	console.time("- looping users");

	let ledger = new Map<
		string,
		{
			places: number;
			grades: number[];
			// First index where the user has failed, in bravoGrades
			failIndex: number;
		}
	>(
		nonVirginAgreements.map((a) => [
			a.id,
			{ places: a.places, grades: [], failIndex: -1 },
		])
	);

	let userUpdates = new Map<string, number[]>();

	for (let user of users) {
		let alphaRanks: number[] = [];

		let sortedAgreements = sortDocs(user.agreements, user.agreementOrder);

		// Suppose the user has the right for each agreement
		for (let option of sortedAgreements) {
			// FIXME

			// If agreement isn't in ledger, add it
			if (!ledger.has(option.id)) {
				ledger.set(option.id, {
					places: option.places,
					grades: [],
					failIndex: -1,
				});
			}

			//! Might want to clean up after a user has been removed
			if (ledger.get(option.id)!.grades.length === 0) {
				ledger.set(option.id, {
					...ledger.get(option.id)!,
					failIndex: -1,
				});
			}

			// Get the ranking
			let { places, grades, failIndex } = ledger.get(option.id)!;
			let cursor = grades.length;

			// At this point: current user has the priority
			let alphaRank = cursor + 1;
			alphaRanks.push(alphaRank);

			let newFailIndex = failIndex === -1 && user.fail ? cursor : failIndex;

			// Take the next place
			ledger.set(option.id, {
				places,
				grades: [...grades, user.gpa],
				failIndex: newFailIndex,
			});

			// Found happiness
			if (alphaRank <= places) break;
		}

		userUpdates.set(user.id, alphaRanks);
	}

	console.timeEnd("- looping users");

	console.time("- updating agreements & users");

	// Update agreements Bravo cache
	// Update users Alpha cache
	await Promise.all([
		...[...ledger].map(([id, value]) =>
			prisma.agreement.update({
				where: { id },
				data: {
					grades: value.grades,
					failIdx: value.failIndex,
				},
			})
		),

		...[...userUpdates].map(([id, value]) =>
			prisma.user.update({
				where: { id },
				data: {
					alphaRanks: value,
				},
			})
		),
	]).then((r) => {
		console.timeEnd("- updating agreements & users");

		console.timeEnd("refreshPredictions");
		return r;
	});
}
