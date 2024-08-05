import { Header } from "@/components/ui/Header";
import prisma from "@/lib/prisma";

interface Params {
	params: {
		id: string;
	};
}

export default async function Agreement({ params: { id } }: Params) {
	const agreement = await getAgreement(id);

	return (
		<>
			<Header />
			<main>
				<p>
					{agreement ? (
						<>
							<strong>{agreement.uni.name}</strong> <br />
							{agreement.sections.join(", ")} - {agreement.places} places
						</>
					) : (
						"Agreement not found"
					)}
				</p>
			</main>
		</>
	);
}

function getAgreement(id: string) {
	return prisma.agreement.findUnique({
		where: { id },
		include: { uni: true },
	});
}
