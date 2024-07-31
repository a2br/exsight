import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import prisma from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [Google],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async authorized({ auth, request: { nextUrl } }) {
			// Is not authed, redirect to login
			const isAuthed = !!auth;
			const registeredUser =
				isAuthed &&
				(await prisma.user.findUnique({
					where: { email: auth?.user?.email! },
				}));
			// const isOnApp = nextUrl.pathname.startsWith("/dash");

			if (!isAuthed) return Response.redirect(new URL("/login", nextUrl));
			if (!registeredUser)
				return Response.redirect(new URL("/config", nextUrl));

			return true;
		},
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
});
