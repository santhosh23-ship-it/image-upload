import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* =====================================================
   ✅ GET SINGLE USER / ADMIN
===================================================== */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID missing" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { images: true } },
        payments: {
          where: { status: "SUCCESS" },
          select: { id: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        imageCount: user._count.images,
        paymentCount: user.payments.length,
        paymentDone: user.payments.length > 0,
      },
    });

  } catch (error) {
    console.error("GET Error:", error);
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
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (existingUser.organizationId !== session.user.organizationId) {
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );
    }

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
   ✅ DELETE USER (Fully Debugged Version)
===================================================== */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("❌ No session found");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      console.log("❌ ID missing");
      return NextResponse.json(
        { message: "User ID missing" },
        { status: 400 }
      );
    }

    console.log("🟡 DELETE REQUEST ID:", id);
    console.log("🟡 SESSION USER:", session.user);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    console.log("🟡 DB USER:", user);

    if (!user) {
      console.log("❌ User not found in DB");
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    /* ===============================
       ORG SECURITY CHECK
    =============================== */

    // If your session has organizationId
    if (
      session.user.organizationId &&
      user.organizationId !== session.user.organizationId
    ) {
      console.log("❌ Organization mismatch");
      console.log("User Org:", user.organizationId);
      console.log("Session Org:", session.user.organizationId);

      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );
    }

    /* ===============================
       DELETE
    =============================== */

    await prisma.user.delete({
      where: { id },
    });

    console.log("✅ User deleted successfully");

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("🔥 DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}