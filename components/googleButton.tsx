import { signIn } from "@/auth";
import React from "react";

// Takes one additional argument, "title"
const GoogleButton: React.FC = async () => {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("google");
			}}
		>
			<button type="submit">Sign in with Google</button>
		</form>
	);
};

export default GoogleButton;
