import { Agreement, University } from "@prisma/client";
import { User } from "next-auth";
import React from "react";

export const Walkthrough: React.FC<{
	user: User;
	agreements: (Agreement & { uni: University })[];
}> = ({ user, agreements: agr }) => {
	return (
		<div
			style={{
				backgroundColor: "white",
				color: "black",
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
				Walkthrough
			</h2>
			<div
				style={{
					marginTop: "1em",
				}}
			>
				{agr.map((a) => (
					<li key={a.id}>{a.uni.name}</li>
				))}
			</div>
		</div>
	);
};
