"use client";

import { Agreement, University, User } from "@prisma/client";
import React, { useState } from "react";
import { MyPicks } from "./MyPicks";
import { Walkthrough } from "./Walkthrough";
import { sortDocs } from "@/lib/util";

export const MyAgreements: React.FC<{
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
		<>
			<MyPicks
				user={JSON.parse(JSON.stringify(user))}
				agreements={agr}
				onUpdate={onUpdate}
			/>
			<Walkthrough user={JSON.parse(JSON.stringify(user))} agreements={agr} />
		</>
	);
};
