import { auth } from "@/auth";
import FormLayout from "@/components/formLayout";
import FormText from "@/components/formText";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import "./style.css";
import { RegisterForm } from "@/components/registerForm";
import { BRAND_NAME } from "@/lib/util";

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
			<FormLayout title={"Register to " + BRAND_NAME}>
				<FormText>
					Welcome,{" "}
					<strong>{(session.user as any).firstName.split(" ")[0]}</strong>!
					Please tell us about your section and first-year grade average. You
					can find it on ISA. If you’re able, you may add more than two
					decimals.
				</FormText>
				<RegisterForm />
			</FormLayout>
		</main>
	);
}
