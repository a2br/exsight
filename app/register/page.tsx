import { auth } from "@/auth";
import FormLayout from "@/components/formLayout";
import FormText from "@/components/formText";
import GoogleButton from "@/components/googleButton";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
	let session = await auth();
	// If there's a session, redirect to main app
	if (!session) redirect("/login");
	const user =
		(session?.user?.email &&
			(await prisma.user.findUnique({
				where: { email: session.user.email },
			}))) ||
		null;
	if (user) redirect("/");

	return (
		<main>
			<FormLayout>
				<FormText>
					Let's register, {(session.user as any).firstName || "welcome"}!
				</FormText>
			</FormLayout>
		</main>
	);
}
