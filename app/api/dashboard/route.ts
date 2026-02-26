import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

   // ===============================
// USER DASHBOARD
// ===============================
if (session.user.role === "USER") {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

const totalUploads = await prisma.image.count({
  where: { uploadedById: session.user.id },
});

  return NextResponse.json({
    role: "USER",
    name: user?.name,
    email: user?.email,
    totalUploads,
  });
}
    // ===============================
    // PRODUCT OWNER
    // ===============================
    if (session.user.role === "PRODUCT_OWNER") {
      const organizations = await prisma.organization.findMany({
        include: { users: true },
      });

      const formatted = organizations.map((org) => ({
        id: org.id,
        name: org.name,
        adminCount: org.users.filter((u) => u.role === "ADMIN").length,
        userCount: org.users.filter((u) => u.role === "USER").length,
      }));

      return NextResponse.json({
        role: "PRODUCT_OWNER",
        organizations: formatted,
      });
    }

    // ===============================
    // ADMIN
    // ===============================
    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      include: { users: true },
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    const admins = organization.users
      .filter((u) => u.role === "ADMIN")
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      }));

    const users = organization.users
      .filter((u) => u.role === "USER")
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      }));

    const totalImages = await prisma.image.count({
      where: { organizationId: organization.id },
    });

    const totalPayments = await prisma.payment.count({
      where: {
        organizationId: organization.id,
        status: "SUCCESS",
      },
    });

    return NextResponse.json({
      role: "ADMIN",
      organizationName: organization.name,
      adminCount: admins.length,
      userCount: users.length,
      totalImages,
      totalPayments,
      admins,
      users,
    });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}