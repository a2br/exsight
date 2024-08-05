"use client";

import { Section } from "@/lib/epfl";
import { Agreement, University, User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type SuperAg = Agreement & { uni: University };

export const AgreementBrowser: React.FC<{
	user: User & { agreements: SuperAg[] };
	agreements: SuperAg[];
}> = ({ user, agreements }) => {
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
		<div>
			<h2>Search</h2>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search..."
			/>
			<ul>
				{results.map((ag) => {
					return (
						<li key={ag.id}>
							{ag.uni.name} - {ag.uni.town}, {ag.uni.country}
						</li>
					);
				})}
			</ul>
		</div>
	);
};
