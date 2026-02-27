"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Script from "next/script";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Center,
  Badge,
  Box,
} from "@mantine/core";

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const handlePayment = async () => {
    if (!ready) return alert("Loading payment gateway…");
    setLoading(true);

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
    });
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

        router.push("/user");
        router.refresh();
      },
      theme: {
        color: "#5a3825",
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

      <Container
        size="sm"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          style={{
            width: "100%",
            textAlign: "center",
            background: "linear-gradient(145deg, #ffffff, #f8f5f2)",
            border: "1px solid #eee",
          }}
        >
          <Stack align="center" gap="md">
            <Box
              style={{
                fontSize: 40,
              }}
            >
              ⚠️
            </Box>

            <Title order={2}>Upload Limit Reached</Title>

            <Text c="dimmed" size="sm">
              You’ve used all your image upload credits.
            </Text>

            <Paper
              radius="md"
              p="md"
              style={{
                backgroundColor: "#f3ebe4",
                width: "100%",
              }}
            >
              <Stack gap={4} align="center">
                <Title order={3} style={{ color: "#5a3825" }}>
                  ₹500
                </Title>
                <Text size="xs" c="dimmed">
                  for 5 additional uploads
                </Text>
              </Stack>
            </Paper>

            <Button
              fullWidth
              size="md"
              radius="md"
              onClick={handlePayment}
              disabled={!ready || loading}
              loading={loading}
              style={{
                backgroundColor: "#5a3825",
                fontWeight: 600,
              }}
            >
              Pay & Continue
            </Button>

            <Badge color="green" variant="light">
              🔒 100% Secure Payment via Razorpay
            </Badge>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}