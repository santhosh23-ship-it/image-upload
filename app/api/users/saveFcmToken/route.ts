// app/api/users/saveFcmToken/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, fcmToken } = await req.json();

    if (!userId || !fcmToken) {
      return NextResponse.json(
        { error: "Missing userId or fcmToken" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fcmTokens: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ If first time (null), initialize array
    if (!user.fcmTokens || user.fcmTokens.length === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          fcmTokens: [fcmToken],
        },
      });
    }
    // ✅ If token not already saved → push
    else if (!user.fcmTokens.includes(fcmToken)) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          fcmTokens: {
            push: fcmToken,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save FCM token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}