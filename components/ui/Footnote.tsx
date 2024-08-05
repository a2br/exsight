import { auth, signOut } from "@/auth";

export const Footnote = () => {
	return (
		<div
			style={{
				backgroundColor: "white",
				color: "black",
				padding: "2em",
			}}
		>
			<hr />
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit">Sign out</button>
			</form>
		</div>
	);
};
