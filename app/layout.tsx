import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Session } from "inspector";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { BRAND_COLOR, BRAND_NAME } from "@/lib/util";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: BRAND_NAME,
	description: "Peace of mind applying for exchanges.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="theme-color" content={BRAND_COLOR} />
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
