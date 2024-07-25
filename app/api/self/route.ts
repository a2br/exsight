import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	let agreements = await prisma.agreement.findMany({
		include: { uni: true, users: { select: { gpa: true } } },
		orderBy: { uni: { name: "asc" } },
	});
	return NextResponse.json(agreements);
}

export async function POST(request: NextRequest) {
	let { body } = await request.json();
}
