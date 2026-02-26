import { NextResponse } from "next/server";
import prisma from "@/lib/db";

interface ParamsType {
  params: { id: string } | Promise<{ id: string }>;
}

/* ---------------- DELETE → remove org + its users ---------------- */
export async function DELETE(req: Request, { params }: ParamsType) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Organization ID missing" }, { status: 400 });
    }

    await prisma.user.deleteMany({
      where: { organizationId: id },
    });

    await prisma.organization.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete Org Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete organization" },
      { status: 500 }
    );
  }
}

/* ---------------- PUT → update organization ---------------- */
export async function PUT(req: Request, { params }: ParamsType) {
  try {
    const { id } = await params;
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Organization ID missing" }, { status: 400 });
    }

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        logoUrl: data.logoUrl,
      },
    });

    return NextResponse.json({ success: true, org: updated });
  } catch (err: any) {
    console.error("Update Org Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update organization" },
      { status: 500 }
    );
  }
}



export async function GET(req: Request, { params }: ParamsType) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Organization ID missing" },
        { status: 400 }
      );
    }

    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            _count: {
              select: { images: true },
            },
          },
        },
      },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(org);
  } catch (err: any) {
    console.error("Get Org Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch organization" },
      { status: 500 }
    );
  }
}