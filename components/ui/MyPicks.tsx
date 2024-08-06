"use client";

import { PicksList } from "./PicksList";
import React, { useState } from "react";
import { User, Agreement, University } from "@prisma/client";
import { sortDocs } from "@/lib/util";

export const MyPicks: React.FC<{
	user: User;
	onUpdate: (action: "remove" | "up" | "down", id: string) => void;
	agreements: (Agreement & { uni: University })[];
}> = ({ user, onUpdate, agreements: agr }) => {
	const canEurope = user.gpa >= 4.5;
	const canOverseas = user.gpa >= 5.0;

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
				{canOverseas && (
					<PicksList
						type="wor"
						agreements={agr.filter((a) => a.uni.regionCode !== "EUR")}
						onUpdate={onUpdate}
						display={true}
					/>
				)}
				{canEurope && (
					<PicksList
						type="eur"
						agreements={agr.filter((a) => a.uni.regionCode === "EUR")}
						onUpdate={onUpdate}
						display={canOverseas}
					/>
				)}
			</div>
		</div>
	);
};
