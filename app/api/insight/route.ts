import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Basically the starting point of the UI.
// 1. Information about the selected exchanges
// 2. Information about starred exchanges

export async function GET() {
	let them = await auth();
	// let users = await prisma.user.findMany();
	return NextResponse.json(them);
}
