import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import prisma from "./lib/prisma";
import { NextResponse } from "next/server";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authConfig = {
	providers: [Google],
	// adapter: PrismaAdapter(prisma),
	pages: {
		signIn: "/login",
	},
	callbacks: {
		// async authorized({ auth, request: { nextUrl } }) {
		// 	const isLoggedIn = !!auth?.user;
		// 	const isRegistered =
		// 		isLoggedIn &&
		// 		(await prisma.user.findUnique({
		// 			where: { email: auth?.user?.email! },
		// 		}));

		// 	if (nextUrl.pathname.startsWith("/register")) {
		// 		if (isRegistered) return NextResponse.redirect("/");
		// 		if (!isLoggedIn) return NextResponse.redirect("/login");
		// 		return true;
		// 	}

		// 	if (isRegistered) true;
		// 	if (isLoggedIn) return NextResponse.redirect("/register");

		// 	return NextResponse.redirect("/login");
		// },
		async signIn({ account, profile, user }) {
			if (account?.provider !== "google") {
				return "/auth/error?why=provider";
			}

			// if (!profile?.email_verified) return false;
			if (profile?.hd !== "epfl.ch") {
				return "/auth/error?why=email";
			}

			return true;
		},
		async jwt({ token, user, account, profile }) {
			// user and account are only defined during initial sign-in
			if (account && user && profile) {
				token.accessToken = account.access_token;
				// Add custom fields from the profile
				token.firstName = profile.given_name;
				token.lastName = profile.family_name;
			}
			return token;
		},
		async session({ session, token }) {
			// Pass custom data to the session object
			(session.user as any).firstName = token.firstName;
			(session.user as any).lastName = token.lastName;

			return session;
		},
	},
} satisfies NextAuthConfig;
