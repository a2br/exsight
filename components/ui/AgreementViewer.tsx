"use client";

import { sortDocs } from "@/lib/util";
import { Agreement, University, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { DisplaySections } from "../DisplaySections";

export const AgreementViewer: React.FC<{
	user: User & { agreements: (Agreement & { uni: University })[] };
	agreement: Agreement & { uni: University };
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
		console.log(
			"client order 0: ",
			world.map((a) => a.uni.town)
		);
		// Reassemble
		const newAgr = [...world, ...local];

		console.log(
			"client order: ",
			newAgr.map((a) => a.uni.town)
		);

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

	let added = user.agreementOrder.some((id) => id === agreement.id);

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
					backgroundColor: "#FF9900",
				}}
			></div>
			<h1>{agreement.uni.name}</h1>
			<div style={{ margin: "1em 0" }}>
				<DisplaySections sections={agreement.sections} />
			</div>
			<button
				style={{
					border: "none",
					backgroundColor: added ? "red" : "#ff9900",
					padding: "1em",
					color: "white",
					fontFamily: "inherit",
					width: "100%",
					margin: "2em 0",
				}}
				onClick={added ? removeFromList : addToList}
			>
				{added ? "Remove from list" : "Add to list"}
			</button>
		</div>
	);
};
