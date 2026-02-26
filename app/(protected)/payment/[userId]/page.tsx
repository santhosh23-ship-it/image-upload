"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Script from "next/script";
import "./payment.css";

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const handlePayment = async () => {
    if (!ready) return alert("Loading payment gateway…");
    setLoading(true);

    const res = await fetch("/api/payment/create-order", { method: "POST" });
    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Image Upload System",
      description: "Add 5 Image Credits",
      handler: async (response: any) => {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const data = await verifyRes.json();

        if (data.success) {
          alert("Payment successful 🎉 5 images added");
        }

        router.push("/user/dashboard/${userId}")
        router.refresh();
      },
      theme: {
        color: "#5a3825", // 👈 brown theme
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    new (window as any).Razorpay(options).open();
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />

      <div className="payment-container">
        <div className="payment-card">
          <div className="icon">⚠️</div>

          <h1>Upload Limit Reached</h1>
          <p className="subtitle">
            You’ve used all your image upload credits.
          </p>

          <div className="price-box">
            <span className="price">₹500</span>
            <span className="desc">for 5 additional uploads</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={!ready || loading}
            className="pay-btn"
          >
            {loading ? "Processing..." : "Pay & Continue"}
          </button>

          <p className="secure">🔒 100% Secure Payment via Razorpay</p>
        </div>
      </div>
    </>
  );
}