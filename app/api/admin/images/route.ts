import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !["ADMIN", "PRODUCT_OWNER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = await prisma.image.findMany({
    where: {
      uploadedById: session.user.id, // 🔥 only admin uploaded
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(images);
}
