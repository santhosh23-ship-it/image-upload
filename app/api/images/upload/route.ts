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

    if (!session?.user?.id || !session.user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    let tagIds: string[] = [];
    const rawTags = formData.get("tags");
    if (rawTags) {
      tagIds = JSON.parse(rawTags.toString());
    }

    // Limit for normal users
    if (!isAdmin) {
      const count = await prisma.image.count({
        where: { uploadedById: session.user.id },
      });

      if (count + files.length > 5) {
        return NextResponse.json(
          { error: "Max 5 images allowed" },
          { status: 403 }
        );
      }
    }

    const createdImages = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `users/${session.user.id}/${Date.now()}-${file.name}`;

      // Upload to S3
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // Save in Image table
      const image = await prisma.image.create({
        data: {
          url: imageUrl,
          uploadedById: session.user.id,
          organizationId: session.user.organizationId,
          tags: tagIds,
        },
      });

      // 🔥 Save URL inside User.imageUrls array
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          imageUrls: {
            push: imageUrl,
          },
        },
      });

      createdImages.push(image);

      // Notification logic
      let receivers: string[] = [];

      if (tagIds.length > 0) {
        receivers = tagIds;
      } else {
        const orgUsers = await prisma.user.findMany({
          where: {
            organizationId: session.user.organizationId,
            id: { not: session.user.id },
          },
          select: { id: true },
        });

        receivers = orgUsers.map((u) => u.id);
      }

      await Promise.all(
        receivers.map((receiverId) =>
          firestore.collection("notifications").add({
            senderId: session.user.id,
            receiverId,
            message:
              tagIds.length > 0
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

    return NextResponse.json({
      success: true,
      uploadedImages: createdImages,
    });
  } catch (err) {
    console.error("Upload ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}