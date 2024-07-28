import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { User } from "@prisma/client";

export async function getAuthedUser(): Promise<User | null> {
	let them = await auth();
	// Find user in database
	let user = them?.user?.email
		? await prisma.user.findUnique({
				where: {
					email: them.user.email,
				},
		  })
		: null;
	return user;
}
