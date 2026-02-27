import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* =====================================================
   ✅ GET USERS UNDER AN ADMIN (ONLY ROLE = USER)
===================================================== */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Admin ID missing" },
        { status: 400 }
      );
    }

    /* ===============================
       🔹 GET ADMIN DETAILS
    =============================== */
    const admin = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { images: true } },
        payments: {
          where: { status: "SUCCESS" },
          select: { id: true },
        },
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    /* ===============================
       🔹 FIND ORGS MANAGED BY ADMIN
    =============================== */
    const orgs = await prisma.organization.findMany({
      where: { adminId: id },
      select: { id: true },
    });

    if (!orgs.length) {
      return NextResponse.json({
        success: true,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          imageCount: admin._count.images,
        },
        users: [],
      });
    }

    const orgIds = orgs.map((o) => o.id);

    /* ===============================
       🔹 GET ONLY USERS (NOT ADMIN)
    =============================== */
    const users = await prisma.user.findMany({
      where: {
        organizationId: { in: orgIds },
        role: "USER", // ✅ ONLY USERS
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        imageCount: admin._count.images,
        paymentDone: admin.payments.length > 0,
      },
      users,
    });

  } catch (error) {
    console.error("GET Admin Users Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   ✅ UPDATE USER
===================================================== */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    let hashedPassword;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   ✅ DELETE USER
===================================================== */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}