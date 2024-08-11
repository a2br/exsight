"use client";

import { Section } from "@/lib/epfl";
import { Agreement, University, User } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { DisplaySections } from "../DisplaySections";
import { DiVim } from "react-icons/di";

type SuperAg = Agreement & { uni: University };

export const AgreementBrowser: React.FC<{
	user: User & { agreements: SuperAg[] };
}> = ({ user }) => {
	const params = useSearchParams();
	const to = params.get("to")?.toUpperCase();

	let region: "EUR" | "WOR" | null = null;
	let num: number | null = null;
	if (to) {
		if (to.includes(" ")) {
			region = to.split(" ")[0] as "EUR" | "WOR";
			num = parseInt(to.split(" ")[1]);
		} else if (to === "EUR" || to === "WOR") {
			region = to as "EUR" | "WOR";
		}
	}

	let [query, setQuery] = React.useState("");
	let [results, setResults] = React.useState<SuperAg[]>([]);

	useEffect(() => {
		fetchResults(query);
	}, [query, params]);

	const fetchResults = async (query?: string) => {
		if (query && query.length < 3) return;

		let url = "/api/schools";
		let params = new URLSearchParams();
		params.set("s", user.section);
		if (region) params.set("r", region);
		if (query) params.set("q", query);

		url += "?" + params.toString();

		let res = await fetch(url);
		let data = await res.json();

		setResults(data.agreements);

		return data.agreements as SuperAg[];
	};

	return (
		<div style={{ margin: "2em" }}>
			<h2>Search</h2>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search whole words..."
				style={{
					margin: "1em 0",
					fontFamily: "inherit",
					width: "100%",
					border: "1px solid #e6e6e6",
					padding: "1em",
				}}
			/>
			<ul>
				{results.map((ag) => (
					<AgreementBox key={ag.id} agreement={ag} i={num ?? undefined} />
				))}
			</ul>
		</div>
	);
};

const AgreementBox: React.FC<{ agreement: SuperAg; i?: number }> = ({
	agreement: ag,
	i,
}) => {
	let link = `/a/${ag.id}`;
	if (i !== undefined) link += `?to=${i}`;
	return (
		<Link href={link} style={{ textDecoration: "none", color: "inherit" }}>
			<div
				style={{
					margin: "1em 0",
					padding: "1em",
					border: "1px solid #E6E6E6",
					minHeight: "8em",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<h3
					style={{
						marginBottom: "0.5em",
						fontWeight: 500,
					}}
				>
					{ag.uni.name}&nbsp;&#8209;{">"}
				</h3>
				<div style={{ marginTop: "auto" }}>
					<div style={{ fontWeight: 300 }}>
						{ag.uni.town}, {ag.uni.country}
					</div>
					<DisplaySections sections={ag.sections} number={ag.places} />
				</div>
			</div>
		</Link>
	);
};
