import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  // Prevent duplicate
  const existingPayment = await prisma.payment.findFirst({ where: { transactionId: razorpay_payment_id } });
  if (existingPayment) return NextResponse.json({ success: true });

  // Save payment & increment quotas
  const [ updatedUser] = await Promise.all([
    prisma.organization.update({
      where: { id: session.user.organizationId },
      data: { imageQuota: { increment: 5 } },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { imageQuota: { increment: 5 } },
    }),
    prisma.payment.create({
      data: {
        userId: session.user.id,
        organizationId: session.user.organizationId,
        amount: 500,
        slotsPurchased: 5,
        transactionId: razorpay_payment_id,
        status: "SUCCESS",
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    addedQuota: 5,
    // remainingOrgQuota: updatedOrg.imageQuota,
    remainingUserQuota: updatedUser.imageQuota,
  });
}
