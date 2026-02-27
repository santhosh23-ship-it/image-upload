// /app/api/images/gallery/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";

  let images;

  if (isAdmin) {
    // ✅ Admin sees ALL images in organization
    images = await prisma.image.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } else {
    // ✅ User sees ONLY images where they are tagged
    images = await prisma.image.findMany({
      where: {
        organizationId: session.user.organizationId,
        tags: {
          has: session.user.id, // string[]
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // ✅ Fetch tag user details manually
  const userIds = [
    ...new Set(images.flatMap(img => img.tags)),
  ];

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  const formattedImages = images.map(img => ({
    ...img,
    taggedUsers: users.filter(u => img.tags.includes(u.id)),
  }));

  return NextResponse.json(formattedImages);
}