// app/api/user/images/route.ts
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

  let images = [];

  if (isAdmin) {
    images = await prisma.image.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true } },
      },
    });
  } else {
    images = await prisma.image.findMany({
      where: {
        organizationId: session.user.organizationId,
        OR: [
          { uploadedById: session.user.id },
          { tags: { has: session.user.id } }, // ✅ filter by ID
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true } },
      },
    });
  }

  // 🔥 Convert tag IDs to user names
  const allTagIds = [...new Set(images.flatMap(img => img.tags))];

  const tagUsers = await prisma.user.findMany({
    where: { id: { in: allTagIds } },
    select: { id: true, name: true },
  });

  const formattedImages = images.map(img => ({
    ...img,
    taggedUsers: tagUsers.filter(user =>
      img.tags.includes(user.id)
    ),
  }));

  return NextResponse.json(formattedImages);
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { url, organizationId, uploadedById, tags } = body;

    if (!url || !organizationId || !uploadedById) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const image = await prisma.image.create({
      data: {
        url,
        organizationId,
        uploadedById,
        tags: tags || [], // ✅ tags = ["Mani", "Rahul"]
      },
    });

    return NextResponse.json({ success: true, image });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}