"use client";

import { signOut } from "next-auth/react";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

export const AccountManager: React.FC<{ user: User }> = ({ user }) => {
	return (
		// Actions
		<div style={{ marginTop: "1em" }}>
			<h3>Profile</h3>
			<div style={{ margin: "0.5em 0" }}>
				<p>
					<strong>Name:</strong> {user.name}
				</p>
				<p>
					<strong>Email:</strong> {user.email}
				</p>
				<p>
					<strong>Section:</strong> {user.section}
				</p>
				<p>
					<strong>GPA:</strong> {user.gpa}
				</p>
				<p>
					<strong>Low priority (MàN, etc):</strong> {user.fail ? "Yes" : "No"}
				</p>
			</div>
			<hr style={{ margin: "1em 0" }} />
			<h3>Actions</h3>
			<div
				style={{
					marginTop: "1em",
					display: "flex",
					flexDirection: "column",
					gap: "0.4em",
				}}
			>
				{/* Sign out button */}
				<SettingsButton onClick={signOut} label="Sign out" />
				{/* Remove account button */}
				<SettingsButton
					onClick={deleteAccount}
					label="Reset & remove account"
					style={{
						color: "red",
						borderColor: "red",
					}}
				/>
			</div>
		</div>
	);
};

const SettingsButton: React.FC<{
	onClick: () => unknown;
	label: string;
	style?: React.CSSProperties;
}> = ({ onClick, label, style }) => {
	return (
		<button
			style={{
				height: "3em",
				padding: "1em",
				backgroundColor: "inherit",
				fontFamily: "inherit",
				border: "1px solid #B6B6B6",
				...style,
			}}
			onClick={onClick}
		>
			{label}
		</button>
	);
};

async function logOut() {
	await signOut();
	redirect("/login");
}

async function deleteAccount() {
	await fetch("/api/account", { method: "DELETE" });
	window.location.href = "/register";
}
