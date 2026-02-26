import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";



export async function POST(req: Request) {
  try {
    const {
      name,
      address,
      phone,
      logoUrl,
      adminEmail,
      adminPassword,
    } = await req.json();

    if (!name || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Admin email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 🔥 Transaction (Safe DB operation)
    const data = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create Organization
      const org = await tx.organization.create({
        data: {
          name,
          address,
          phone,
          logoUrl,
        },
      });

      // 2️⃣ Create Admin User
      const admin = await tx.user.create({
        data: {
          name: adminEmail.split("@")[0],
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN",
          organizationId: org.id,
          isSystemAdmin: true,
        },
      });

      // 3️⃣ Update Organization → set adminId
      await tx.organization.update({
        where: { id: org.id },
        data: {
          adminId: admin.id,   // ✅ THIS STORES IN DB
        },
      });

      return { org, admin };
    });

    return NextResponse.json({
      success: true,
      organizationId: data.org.id,
      adminId: data.admin.id,
    });

  } catch (error: any) {
    console.error("Create Org Error:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

/* ---------------- GET ALL ORGANIZATIONS ---------------- */
export async function GET() {
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        users: {
          where: { role: "ADMIN" },
          select: { email: true },
        },
      },
    });

    const formatted = orgs.map((org) => ({
      ...org,
      admin: org.users[0] ?? null,
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("Fetch Orgs Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}