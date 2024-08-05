import { auth, signOut } from "@/auth";
import React, { ReactNode } from "react";

type Props = {
	title?: string;
	children: ReactNode;
};

// Takes one additional argument, "title"
const FormLayout: React.FC<Props> = async ({ title = "ExSight", children }) => {
	let sesh = await auth();
	return (
		// Container
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				// alignItems: "center",
				height: "100vh",
			}}
		>
			<div
				style={{
					width: "25em",
					minHeight: "10em",
					margin: "1em",
					marginTop: "10em",
				}}
			>
				{/* Write ExSight, and put visible box right under */}
				{/* Flex div that takes up all width with one element left, one right, and a blank space in between */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<h1
						style={{
							fontSize: "1.2em",
							lineHeight: "1.8em",
						}}
					>
						{title}
					</h1>
					{sesh ? (
						<form
							action={async () => {
								"use server";
								await signOut();
							}}
						>
							<button
								type="submit"
								style={{
									fontFamily: "inherit",
									backgroundColor: "inherit",
									border: "none",
									cursor: "pointer",
								}}
							>
								logout {"->"}
							</button>
						</form>
					) : null}
				</div>

				<div
					style={{
						border: "1px solid #E6E6E6",
						padding: "2em",
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

export default FormLayout;
