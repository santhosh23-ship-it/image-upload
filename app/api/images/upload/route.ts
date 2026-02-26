// /app/api/images/upload/route.ts
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 🔐 SESSION
    const session = await getServerSession(authOptions);
    console.log("DEBUG: SESSION =", session?.user);

    if (!session?.user?.id || !session.user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";
    console.log("DEBUG: isAdmin =", isAdmin);

    // 🔢 FORM DATA
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    console.log("DEBUG: files received =", files.map(f => f.name));

    // ✅ TAGS
    let rawTags = formData.get("tags");
    let tagIds: string[] = [];

    if (rawTags) {
      try {
        tagIds = typeof rawTags === "string" ? JSON.parse(rawTags) : [];
      } catch {
        // fallback if not JSON
        tagIds = rawTags.toString().split(",").map(t => t.trim());
      }
    }

    console.log("DEBUG: Tags received (user IDs) =", tagIds);

    if (!files.length) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    // 🔢 CHECK QUOTA
    let uploadedCount = await prisma.image.count({
      where: { uploadedById: session.user.id },
    });
    const userQuota = session.user.imageQuota; // includes extra slots from payment
    const remaining = userQuota - uploadedCount;

    console.log("DEBUG: uploadedCount=", uploadedCount, "userQuota=", userQuota, "remaining=", remaining);

    if (!isAdmin && remaining <= 0) {
      console.log("DEBUG: User reached max image limit");
      return NextResponse.json({ error: `User image limit reached (${userQuota} images max)` }, { status: 403 });
    }

    const allowedFiles = !isAdmin ? files.slice(0, remaining) : files;
    const createdImages = [];

    // 🔁 UPLOAD FILES
    for (const file of allowedFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `users/${session.user.id}/${Date.now()}-${file.name}`;

      // ☁️ S3 UPLOAD
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }));

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      console.log("DEBUG: Uploaded Image URL =", imageUrl);

      // 💾 SAVE IMAGE
      const image = await prisma.image.create({
        data: {
          url: imageUrl,
          uploadedById: session.user.id,
          organizationId: session.user.organizationId,
          tags: tagIds, // store tagged user IDs
        },
      });

      // 📌 UPDATE USER.imageUrls
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { imageUrls: { push: imageUrl } },
      });
      console.log("DEBUG: Updated imageUrls in User table =", updatedUser.imageUrls);

      // 🏷 LOG TAGGED USERS
      if (tagIds.length) {
        const taggedUsers = await prisma.user.findMany({
          where: { id: { in: tagIds } },
          select: { id: true, name: true, email: true },
        });
        console.log("DEBUG: Tagged users for this image =", taggedUsers);
      }

      createdImages.push(image);
    }

    return NextResponse.json({
      success: true,
      uploadedImages: createdImages,
      message: `Uploaded ${createdImages.length} image(s) successfully`,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}