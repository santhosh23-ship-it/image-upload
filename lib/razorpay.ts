import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // ✅ FIXED
  key_secret: process.env.RAZORPAY_KEY_SECRET!,     // ✅ OK
  
});
console.log("KEY_ID =", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
console.log("SECRET =", !!process.env.RAZORPAY_KEY_SECRET);
