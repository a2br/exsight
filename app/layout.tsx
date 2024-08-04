import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Session } from "inspector";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ExSight",
	description: "Peace of mind applying for exchanges.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Get the session object from next auth
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
