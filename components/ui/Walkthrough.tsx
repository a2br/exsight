"use client";

import React, { useEffect, useState } from "react";
import { User, Agreement, University } from "@prisma/client";
import { FaArrowsRotate } from "react-icons/fa6";

import { CACHE_DELAY, stringToColor } from "@/lib/util";
import Link from "next/link";

export const Walkthrough: React.FC<{
	user: User;
	agreements: Agreement[];
}> = ({ user: inheritedUser, agreements: agr }) => {
	let [user, setUser] = useState(inheritedUser);
	let [agreements, setAgreements] = useState<
		(Agreement & { uni: University; candidates: number[] })[]
	>([]);
	let [loading, setLoading] = useState(false);

	// Fetch agreements: we need user and relevant agreements
	const fetchInsights = async () => {
		if (loading) return;
		setLoading(true);
		const res = await fetch("/api/insight");
		const data: {
			user: User & {
				agreements: (Agreement & { uni: University; candidates: number[] })[];
			};
		} = await res.json();
		setUser(data.user);
		setAgreements(data.user.agreements);
		setLoading(false);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchInsights();
		}, CACHE_DELAY);

		return () => clearTimeout(timer);
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
					<WalkthroughItem key={i} user={user} agreement={a as any} />
				))}
			</div>
		</div>
	);
};

const WalkthroughItem: React.FC<{
	user: User;
	agreement: Agreement & {
		uni: University;
		candidates: { gpa: number; fail: boolean }[];
	};
}> = ({ user, agreement: a }) => {
	let idx = user.agreementOrder.findIndex((id) => id === a.id);
	let rank = idx + 1;

	// ALPHA INDICES
	let alphaRank = user.alphaRanks[idx];
	let isGettingIn = alphaRank <= a.places;

	// BRAVO INDICES
	let minIdx = user.fail ? (a.failIdx === -1 ? a.grades.length : a.failIdx) : 0;
	let bravoIdx = a.grades.findIndex((g, i) => i >= minIdx && g < user.gpa);
	if (bravoIdx === -1) {
		if (!user.fail && a.failIdx !== -1) {
			bravoIdx = a.failIdx;
		} else {
			bravoIdx = a.grades.length;
		}
	}
	let bravoRank = bravoIdx + 1;
	let bravoGettingIn = bravoRank <= a.places;

	// CHARLIE INDICES
	// user fail
	// 5.4 5.3 5.0 4.5 F5.6 F4.8

	let charlieRank = [...a.candidates].findIndex((candidate) => {
		if (candidate.fail === user.fail) {
			// In the same league.
			return candidate.gpa < user.gpa;
		} else {
			// failed / candidate didn't: keep iterating
			// didn't fail / candidate did: stop
			return !user.fail;
		}
	});
	if (charlieRank === -1) charlieRank = a.candidates.length;
	charlieRank += 1;

	let spareChoice = user.alphaRanks.length <= idx;

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
				}}
			>
				#{rank}
			</span>
			{/* Left block */}
			<Link
				href={`/a/${a.id}`}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "10em",
					height: "10em",
				}}
			></Link>
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
						color:
							spareChoice || !isGettingIn
								? "rgba(255, 255, 255, 0.5)"
								: "white",
					}}
				>
					{a.uni.name}
				</span>
			</div>
			{/* Right block */}
			<div
				style={{
					flex: 1,
					padding: "1em",
					display: "flex",
					flexDirection: "column",
					color: spareChoice || !isGettingIn ? "grey" : "inherit",
				}}
			>
				{spareChoice ? (
					<span
						style={{
							color: spareChoice ? "grey" : "white",
						}}
					>
						{bravoGettingIn
							? `you'd get in as #${bravoRank} out of ${a.places}`
							: `you'd be rejected as #${bravoRank} out of ${a.places}`}
					</span>
				) : (
					<>
						<span
							style={{
								fontWeight: isGettingIn ? 700 : "inherit",
							}}
						>
							{isGettingIn
								? `getting in as #${alphaRank} out of ${a.places}!`
								: `rejected as #${alphaRank} out of ${a.places}`}
						</span>
					</>
				)}
				<span>originally #{charlieRank}</span>
			</div>
		</li>
	);
};
