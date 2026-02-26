// /app/api/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: { organizationId: session.user.organizationId },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error("Users GET ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}