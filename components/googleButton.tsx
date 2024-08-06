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
			<button
				type="submit"
				style={{
					marginTop: "1em",
					fontFamily: "inherit",
					padding: "1em",
					textAlign: "left",
					border: "none",
					width: "100%",
					minHeight: "3em",
					backgroundColor: "#FF9900",
					color: "white",
					fontWeight: 700,
					cursor: "pointer",
				}}
			>
				continue with my EPFL Google account &#8209;{">"}
			</button>
		</form>
	);
};

export default GoogleButton;
