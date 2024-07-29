import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [Google],
	callbacks: {
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
