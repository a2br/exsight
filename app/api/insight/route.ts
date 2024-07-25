import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
	let them = await auth();
	// let users = await prisma.user.findMany();
	return NextResponse.json(them);
}
