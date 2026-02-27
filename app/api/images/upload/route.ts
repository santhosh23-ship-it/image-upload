// app/api/images/upload/route.ts
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { firestore } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.organizationId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isAdmin = session.user.role === "ADMIN";

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });

    let tagIds: string[] = [];
    const rawTags = formData.get("tags");
    if (rawTags) tagIds = JSON.parse(rawTags.toString());

    if (!isAdmin) {
      const count = await prisma.image.count({ where: { uploadedById: session.user.id } });
      if (count + files.length > 5)
        return NextResponse.json({ error: "Max 5 images allowed" }, { status: 403 });
    }

    const createdImages = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `users/${session.user.id}/${Date.now()}-${file.name}`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }));

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // 1️⃣ Create image record
      const image = await prisma.image.create({
        data: {
          url: imageUrl,
          uploadedById: session.user.id,
          organizationId: session.user.organizationId,
          tags: tagIds,
        },
      });

      createdImages.push(image);

      // 2️⃣ Determine receivers
      let receivers: string[] = [];
      if (tagIds.length > 0) {
        receivers = tagIds; // tagged users only
      } else {
        // Send to all users in org, including admins and users, except uploader
        const orgUsers = await prisma.user.findMany({
          where: {
            organizationId: session.user.organizationId,
            id: { not: session.user.id }
          },
          select: { id: true }
        });
        receivers = orgUsers.map(u => u.id);
      }

      // 3️⃣ Create Firestore notifications for each receiver
      await Promise.all(
        receivers.map(receiverId =>
          firestore.collection("notifications").add({
            senderId: session.user.id,
            receiverId,
            message: tagIds.length > 0
              ? `${session.user.name} tagged you in an image`
              : `${session.user.name} uploaded an image`,
            imageUrl,
            imageId: image.id,
            organizationId: session.user.organizationId,
            isRead: false,
            createdAt: FieldValue.serverTimestamp(),
          })
        )
      );
    }

    return NextResponse.json({ success: true, uploadedImages: createdImages });

  } catch (err) {
    console.error("Upload ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}