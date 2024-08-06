"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaAngleUp, FaAngleDown, FaXmark } from "react-icons/fa6";
import { Agreement, University } from "@prisma/client";

import short from "@/public/short.json";

type SuperAgreement = Agreement & { uni: University };

interface Props {
	display?: boolean;
	type: "wor" | "eur";
	agreements: SuperAgreement[];
	onUpdate: (action: "remove" | "up" | "down", id: string) => void;
}

export const PicksList: React.FC<Props> = ({
	display = true,
	type,
	agreements,
	onUpdate,
}) => {
	//TODO Manage changes here
	let buffedAgr =
		agreements.length < 6 ? [...agreements, undefined] : agreements;

	return (
		<div style={{ marginTop: "2em" }}>
			{display && (
				<h3 style={{ fontWeight: 200, marginBottom: "0.4em" }}>
					{type === "eur" ? "Europe" : "Overseas"}
				</h3>
			)}
			{buffedAgr.map((agr, i) => {
				return (
					<Pick key={i} type={type} i={i} agreement={agr} onUpdate={onUpdate} />
				);
			})}
		</div>
	);
};

const Pick: React.FC<{
	i: number;
	type: "wor" | "eur";
	agreement: SuperAgreement | undefined;
	onUpdate: (action: "remove" | "up" | "down", id: string) => void;
}> = ({ i, type, agreement, onUpdate }) => {
	let name =
		agreement && ((short as any)[agreement.uni.name] ?? agreement.uni.name);
	let link = agreement ? `/a/${agreement.id}` : `/add?to=${type}`;
	return (
		<Link href={link} style={{ textDecoration: "none" }}>
			<li
				className={`agr ${!agreement && "empty"}`}
				style={{
					listStyleType: "none",
					padding: "0.5em",
					height: "3.5em",
					backgroundColor: agreement ? "white" : "#ffd18b",
					color: "black",
					marginBottom: "0.2em",
					fontSize: "0.8em",
				}}
			>
				<div
					style={{
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						overflow: "hidden",
						width: "calc(100% - 10em)",
						fontWeight: 600,
					}}
				>
					<span style={{}}>{name ?? "Add a school"}</span>
				</div>
				<span>{agreement?.uni.town ?? `${6 - i} left `}</span> &#8209;{">"}
			</li>
		</Link>
	);
};
