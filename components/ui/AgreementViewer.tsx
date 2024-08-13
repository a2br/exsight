"use client";

import { BRAND_COLOR, sortDocs } from "@/lib/util";
import { Agreement, University, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { DisplaySections } from "../DisplaySections";

export const AgreementViewer: React.FC<{
	user: User & { agreements: (Agreement & { uni: University })[] };
	agreement: Agreement & {
		uni: University;
		candidates: { gpa: number; fail: boolean }[];
	};
	idx?: number;
}> = ({ user, agreement, idx }) => {
	let router = useRouter();
	let sortedAgreements = sortDocs(user.agreements, user.agreementOrder);

	const addToList = async () => {
		if (!agreement) return;
		// Decompose the list
		let world = sortedAgreements.filter((a) => a.uni.regionCode !== "EUR");
		let local = sortedAgreements.filter((a) => a.uni.regionCode === "EUR");

		// Modify the one if possible
		if (idx !== undefined) {
			if (agreement.uni.regionCode !== "EUR" && idx <= world.length)
				world[idx] = agreement;
			if (agreement.uni.regionCode === "EUR" && idx <= local.length)
				local[idx] = agreement;
		} else {
			// Add to the list
			if (agreement.uni.regionCode !== "EUR" && world.length < 6) {
				world.push(agreement);
			}
			if (agreement.uni.regionCode === "EUR" && local.length < 6) {
				local.push(agreement);
			}
		}

		// Reassemble
		const newAgr = [...world, ...local];

		// Update
		const res = await fetch("/api/account", {
			method: "PATCH",
			body: JSON.stringify({ agreements: newAgr.map((a) => a.id) }),
		});

		if (!res.ok) alert("Error updating list");
		// Redirect to home
		if (res.ok) window.location.href = "/";
	};

	const removeFromList = async () => {
		const res = await fetch("/api/account", {
			method: "PATCH",
			body: JSON.stringify({
				agreements: sortedAgreements
					.filter((a) => a.id !== agreement.id)
					.map((a) => a.id),
			}),
		});
		if (!res.ok) alert("Error updating list");
		// Redirect to home
		if (res.ok) window.location.href = "/";
	};

	let isAdded = user.agreementOrder.some((id) => id === agreement.id);

	// Stats
	let minGpa = agreement.grades[agreement.places - 1];
	let atMan = agreement.failIdx !== -1 && agreement.failIdx < agreement.places;

	return (
		<div>
			<button
				onClick={router.back}
				style={{
					border: "none",
					fontFamily: "inherit",
					backgroundColor: "inherit",
				}}
			>
				{"<"}&#8209; back
			</button>
			<div
				style={{
					width: "100%",
					height: "0.2em",
					marginTop: "2em",
					marginBottom: "1em",
					backgroundColor: BRAND_COLOR,
				}}
			></div>
			<h1>{agreement.uni.name}</h1>
			<div style={{ margin: "1em 0" }}>
				<DisplaySections sections={agreement.sections} />
			</div>
			{/* Your full status */}
			<p>
				{minGpa !== undefined
					? `required GPA is at least ${minGpa.toFixed(2)} (${
							atMan ? "after MàN" : "on first try"
					  })`
					: "in this simulation, there's currently room for anyone."}
			</p>
			{/* Needed grade to get in */}
			<button
				style={{
					backgroundColor: "white",
					border: `1px solid ${isAdded ? "red" : BRAND_COLOR}`,
					color: isAdded ? "red" : BRAND_COLOR,
					padding: "1em",
					fontFamily: "inherit",
					width: "100%",
					margin: "2em 0",
				}}
				onClick={isAdded ? removeFromList : addToList}
			>
				{isAdded ? "Remove from list" : "Add to list"}
			</button>
		</div>
	);
};
