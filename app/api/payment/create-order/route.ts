import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST() {
  const order = await razorpay.orders.create({
    amount: 50000,
    currency: "INR",
  });

  return NextResponse.json(order);
}
