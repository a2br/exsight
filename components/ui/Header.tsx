import { BRAND_COLOR } from "@/lib/util";
import Link from "next/link";

export const Header = () => {
	return (
		<header>
			<div
				style={{
					backgroundColor: BRAND_COLOR,
					display: "flex",
					width: "100%",
					borderBottom: "4px solid white",
					padding: "0.6em 2em",
					height: "5em",
				}}
			>
				<Link
					href="/"
					style={{
						textDecoration: "none",
						fontSize: "0.7em",
						marginTop: "auto",
						color: "white",
					}}
				>
					<h1>ExSight</h1>
				</Link>
			</div>
		</header>
	);
};
