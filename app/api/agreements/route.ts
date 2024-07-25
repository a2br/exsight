import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	let agreements = await prisma.agreement.findMany({
		include: { uni: true, users: { select: { gpa: true } } },
		orderBy: { uni: { name: "asc" } },
		omit: { universityId: true, usersId: true },
	});
	return NextResponse.json(agreements);
}
