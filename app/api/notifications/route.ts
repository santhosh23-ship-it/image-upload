import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { firestore, FieldValue } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const senderId = session?.user?.id;
    const senderName = session?.user?.name || "Someone";

    if (!senderId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { receiverId, imageId, organizationId } = body;

    if (!receiverId || !organizationId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const docRef = await firestore.collection("notifications").add({
      senderId,
      receiverId,
      message: `${senderName} tagged you in an image`,
      imageId: imageId || null,
      organizationId,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("🔥 Notification ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}