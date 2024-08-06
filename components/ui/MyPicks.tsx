"use client";

import { PicksList } from "./PicksList";
import React, { useState } from "react";
import { User, Agreement, University } from "@prisma/client";
import { sortDocs } from "@/lib/util";

export const MyPicks: React.FC<{
	user: User & { agreements: (Agreement & { uni: University })[] };
}> = ({ user }) => {
	let [agr, setAgr] = useState(sortDocs(user.agreements, user.agreementOrder));

	const onUpdate = async (action: "remove" | "up" | "down", id: string) => {
		let newAgrs = [...agr];
		let i = newAgrs.findIndex((a) => a.id === id);

		switch (action) {
			case "remove":
				newAgrs = newAgrs.filter((_, j) => j !== i);
				break;
			case "up":
				// Swap one at i-1 and i
				[newAgrs[i], newAgrs[i - 1]] = [newAgrs[i - 1], newAgrs[i]];
				break;
			case "down":
				[newAgrs[i], newAgrs[i + 1]] = [newAgrs[i + 1], newAgrs[i]];
				break;
		}

		// Set remotely
		let res = await fetch("/api/account", {
			method: "PATCH",
			body: JSON.stringify({
				agreements: newAgrs.map((a) => a.id),
			}),
		});

		setAgr(newAgrs);
	};

	return (
		<div
			style={{
				backgroundColor: "#ff9900",
				color: "white",
				padding: "2em",
			}}
		>
			<h2
				style={{
					fontSize: "1.2em",
					fontWeight: 500,
					lineHeight: "normal",
					textDecorationLine: "underline",
					textUnderlineOffset: "0.2em",
				}}
			>
				My Picks
			</h2>
			<div
				style={{
					marginTop: "1em",
				}}
			>
				<PicksList
					type="wor"
					agreements={agr.filter((a) => a.uni.regionCode !== "EUR")}
					onUpdate={onUpdate}
				/>
				<PicksList
					type="eur"
					agreements={agr.filter((a) => a.uni.regionCode === "EUR")}
					onUpdate={onUpdate}
				/>
			</div>
		</div>
	);
};
