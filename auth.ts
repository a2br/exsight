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
	},
});
