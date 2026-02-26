import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { emails } = await req.json();

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Fetch users whose emails match
    const users = await prisma.user.findMany({
      where: { email: { in: emails } },
      select: { id: true, email: true },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
