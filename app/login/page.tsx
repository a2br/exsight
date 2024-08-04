import { auth } from "@/auth";
import FormLayout from "@/components/formLayout";
import FormText from "@/components/formText";
import GoogleButton from "@/components/googleButton";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

// Props
interface Props {
	hello: string;
}

export default async function LoginPage({ hello }: Props) {
	let session = await auth();
	// If there's a session, redirect to main app
	if (session) redirect("/");

	return (
		<main>
			<FormLayout>
				<FormText>
					This website helps EPFL second-years choose their exchanges. We run a
					simulation of the selection process based on your list, and flag each
					school with your chances of getting in.
				</FormText>
				<FormText>
					Take the Google Sheets system, buff it up, and you get ExSight.
				</FormText>
				<GoogleButton />
			</FormLayout>
		</main>
	);
}
