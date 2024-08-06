"use client";

import React, { useEffect, useState } from "react";
import { User, Agreement, University } from "@prisma/client";
import { FaArrowsRotate } from "react-icons/fa6";

import { stringToColor } from "@/lib/util";

export const Walkthrough: React.FC<{
	user: User;
	agreements: (Agreement & { uni: University })[];
}> = ({ user: inheritedUser, agreements: agr }) => {
	let [user, setUser] = useState(inheritedUser);
	let [agreements, setAgreements] = useState(agr);
	let [loading, setLoading] = useState(false);

	// Fetch agreements: we need user and relevant agreements
	const fetchInsights = async () => {
		if (loading) return;
		setLoading(true);
		const res = await fetch("/api/insight");
		const data: {
			user: User & { agreements: (Agreement & { uni: University })[] };
		} = await res.json();
		setUser(data.user);
		setAgreements(data.user.agreements);
		setLoading(false);
	};

	useEffect(() => {
		fetchInsights();
	}, [agr]);

	return (
		<div
			style={{
				backgroundColor: "white",
				color: "black",
				padding: "2em",
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
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
				<FaArrowsRotate
					onClick={fetchInsights}
					color={loading ? "grey" : "black"}
				/>
			</div>

			<div
				style={{
					marginTop: "1em",
					display: "flex",
					flexDirection: "column",
					gap: "0.4em",
				}}
			>
				{agreements.map((a, i) => (
					<WalkthroughItem key={i} user={user} agreement={a} />
				))}
			</div>
		</div>
	);
};

const WalkthroughItem: React.FC<{
	user: User;
	agreement: Agreement & { uni: University };
}> = ({ user, agreement: a }) => {
	let rank = user.agreementOrder.findIndex((id) => id === a.id) + 1;

	return (
		<li
			key={a.id}
			style={{
				listStyleType: "none",
				height: "10em",
				backgroundColor: "white",
				marginBottom: "0.2em",
				display: "flex",
				flexDirection: "row",
				border: "1px solid #E6E6E6",
				position: "relative",
			}}
		>
			<span
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					color: "rgba(255, 255, 255, 0.5)",
					fontSize: "1em",
					padding: "1em",
					// zIndex: -1,
				}}
			>
				#{rank}
			</span>
			<div
				style={{
					flexShrink: 0,
					width: "10em",
					display: "flex",
					flexDirection: "column",
					padding: "1em",
					backgroundColor: stringToColor(a.uni.name),
				}}
			>
				<span
					style={{
						marginTop: "auto",
						marginLeft: "auto",
						textAlign: "right",
						fontWeight: 700,
						fontSize: "1em",
						color: "white",
					}}
				>
					{a.uni.name}
				</span>
			</div>
			<div style={{ flex: 1 }}></div>
		</li>
	);
};
