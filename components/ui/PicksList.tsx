"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Agreement, University } from "@prisma/client";

import short from "@/public/short.json";

import { FaAngleUp, FaAngleDown, FaXmark } from "react-icons/fa6";

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
					<Pick
						key={i}
						type={type}
						i={i}
						agreements={agreements}
						onUpdate={onUpdate}
					/>
				);
			})}
		</div>
	);
};

const Pick: React.FC<{
	i: number;
	type: "wor" | "eur";
	agreements: SuperAgreement[];
	onUpdate: (action: "remove" | "up" | "down", id: string) => void;
}> = ({ i, type, agreements, onUpdate }) => {
	let agreement = agreements[i];

	let name =
		agreement && ((short as any)[agreement.uni.name] ?? agreement.uni.name);
	let link = agreement ? `/a/${agreement.id}` : `/add?to=${type}`;

	return (
		<li
			className={`agr ${!agreement && "empty"}`}
			style={{
				listStyleType: "none",
				padding: "0.5em",
				height: "3.5em",
				backgroundColor: agreement ? "white" : "#ffffff75",
				marginBottom: "0.2em",
				fontSize: "0.8em",
				display: "flex",
				flexDirection: "row",
			}}
		>
			<Link
				href={link}
				style={{
					textDecoration: "none",
					color: "black",
					flex: 1,
					minWidth: 0,
					width: "100%",
				}}
			>
				{/* Info box*/}
				<div>
					<div
						style={{
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							overflow: "hidden",
							fontWeight: 600,
						}}
					>
						<span style={{}}>{name ?? "Add a school"}</span>
					</div>
					<span>{agreement?.uni.town ?? `${6 - i} left `}</span> &#8209;{">"}
				</div>{" "}
			</Link>
			{/* Toolbox */}
			{agreement && (
				<div
					style={{
						flexShrink: 0,
						marginLeft: "1.5em",
						display: "flex",
						flexDirection: "row",
						alignContent: "center",
						flexWrap: "wrap",
						gap: "0.5em",
					}}
				>
					{/* Fixed size tools box */}
					{i !== 0 && (
						<ActionIcon id={agreement.id} action="up" onClick={onUpdate} />
					)}
					{i !== agreements.length - 1 && (
						<ActionIcon id={agreement.id} action="down" onClick={onUpdate} />
					)}
					<ActionIcon id={agreement.id} action="remove" onClick={onUpdate} />
				</div>
			)}
		</li>
	);
};

const ActionIcon: React.FC<{
	id: string;
	action: "remove" | "up" | "down";
	onClick: (action: "remove" | "up" | "down", id: string) => void;
}> = ({ id, action, onClick }) => {
	let Icon =
		action === "remove" ? FaXmark : action === "up" ? FaAngleUp : FaAngleDown;
	return (
		<Icon color="black" onClick={() => onClick(action, id)} size="1.5em" />
	);
};
