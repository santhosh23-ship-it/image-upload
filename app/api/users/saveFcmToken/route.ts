// filename: app/api/users/saveFcmToken/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, fcmToken } = await req.json();
    if (!userId || !fcmToken) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.fcmTokens.includes(fcmToken)) {
      await prisma.user.update({
        where: { id: userId },
        data: { fcmTokens: { push: fcmToken } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save FCM token error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}