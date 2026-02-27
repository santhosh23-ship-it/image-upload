import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { s3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

/* =======================
   DELETE IMAGE
======================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ FIX: unwrap params
  const { id: imageId } = await context.params;

  if (!imageId) {
    return NextResponse.json(
      { error: "Missing image ID" },
      { status: 400 }
    );
  }

  const image = await prisma.image.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    return NextResponse.json(
      { error: "Image not found" },
      { status: 404 }
    );
  }

  // ✅ Permission check
  if (
    image.uploadedById !== session.user.id &&
    session.user.role !== "ADMIN" &&
    image.organizationId !== session.user.organizationId
  ) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    // Delete from S3
    const key = image.url.split(".amazonaws.com/")[1];

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })
    );

    // Delete from DB
    await prisma.image.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}

/* =======================
   GET USER DETAILS
======================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ unwrap params
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing ID" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        images: true,
        payments: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Collect tag IDs
    const tagIds = [...new Set(user.images.flatMap(img => img.tags))];

    // Convert ID → Name
    const tagUsers = await prisma.user.findMany({
      where: { id: { in: tagIds } },
      select: { id: true, name: true },
    });

    const tagNames = tagUsers.map(u => u.name);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        imageCount: user.images.length,
        paymentCount: user.payments.length,
        tags: tagNames,
      },
    });

  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}