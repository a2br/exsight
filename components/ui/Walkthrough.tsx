"use client";

import React, { useEffect, useState } from "react";
import { User, Agreement, University } from "@prisma/client";
import { FaArrowsRotate } from "react-icons/fa6";

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
	return <li key={a.id}>{a.uni.name}</li>;
};
