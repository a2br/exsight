import { auth, signOut } from "@/auth";
import { Section, sectionColor, sections } from "@/lib/epfl";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const Footnote = async () => {
	const sesh = await auth();
	const user = await prisma.user.findUnique({
		where: { email: sesh!.user!.email! },
	});
	const section = user!.section;

	const userCount = await prisma.user.count();
	let sectionCount: Record<string, number> = {};

	for (let s of sections) {
		sectionCount[s] = await prisma.user.count({
			where: { section: s },
		});
	}

	return (
		<div
			style={{
				backgroundColor: "white",
				color: "black",
				padding: "2em",
				paddingTop: "0",
			}}
		>
			<div
				style={{
					width: "100%",
					height: "1px",
					backgroundColor: "#B5B5B5",
					margin: "1em 0",
				}}
			></div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					color: "inherit",
					fontWeight: 600,
				}}
			>
				<span>{userCount} users registered on ExSight. </span>
				<span>Thank you for participating.</span>
				<Link
					href="/settings"
					style={{
						textDecoration: "none",
						color: "inherit",

						textDecorationLine: "underline",
						textUnderlineOffset: "0.2em",
					}}
				>
					<span>
						{user!.name}&nbsp;&#8209;{">"}
					</span>
				</Link>
			</div>
		</div>
	);
};
