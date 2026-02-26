import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { firestore } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    console.log("🔔 Notification API called");

    const session = await getServerSession(authOptions);
    const senderId = session?.user?.id;
    if (!senderId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { receiverId, message, imageId, organizationId } = await req.json();
    console.log("Request body:", { receiverId, message, imageId, organizationId });

    if (!message || !organizationId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // CASE 1: A specific user is tagged
    if (receiverId) {
      const docRef = await firestore.collection("notifications").add({
        senderId,
        receiverId,
        message,
        imageId: imageId || null,
        organizationId,
        createdAt: new Date(),
      });

      console.log("✅ Notification sent to tagged user:", receiverId, docRef.id);
      return NextResponse.json({ success: true, id: docRef.id });
    }

    // CASE 2: No tag → send to all users in the organization
    const usersSnapshot = await firestore
      .collection("users")
      .where("organizationId", "==", organizationId)
      .get();

    const batch = firestore.batch();
    usersSnapshot.forEach((userDoc) => {
      const docRef = firestore.collection("notifications").doc();
      batch.set(docRef, {
        senderId,
        receiverId: userDoc.id,
        message,
        imageId: imageId || null,
        organizationId,
        createdAt: new Date(),
      });
    });

    await batch.commit();
    console.log("✅ Notification sent to all users in organization:", organizationId);

    return NextResponse.json({ success: true, count: usersSnapshot.size });
  } catch (err) {
    console.error("Notification ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}