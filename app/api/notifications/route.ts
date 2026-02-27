import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { firestore } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    console.log("🔔 Notification API HIT");

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    const senderId = session?.user?.id;
    const senderName = session?.user?.name;

    if (!senderId) {
      console.log("❌ No senderId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request Body:", body);

    const { receiverId, imageId, organizationId } = body;

    if (!receiverId || !organizationId) {
      console.log("❌ Missing receiverId or organizationId");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("✅ Creating Firestore notification...");

    const docRef = await firestore.collection("notifications").add({
      senderId,
      receiverId,
      message: `${senderName} tagged you in an image`,
      imageId: imageId || null,
      organizationId,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log("✅ Notification CREATED with ID:", docRef.id);

    return NextResponse.json({ success: true, id: docRef.id });

  } catch (err) {
    console.error("🔥 Notification ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}