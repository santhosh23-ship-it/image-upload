"use client";

import { Button, Stack, Text, Card, Box } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState<string>("");

  // 🔐 Protect route
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  // ✅ Set active button based on current URL
  useEffect(() => {
    if (!pathname) return;

    if (pathname.includes("/organization"))
      setActiveButton("organization");
    else if (pathname.includes("/dashboard"))
      setActiveButton("dashboard");
    else if (pathname.includes("/admin") && !pathname.includes("/gallery"))
      setActiveButton("admin");
    else if (pathname.includes("/user") && !pathname.includes("/gallery"))
      setActiveButton("user");
  }, [pathname]);

  if (status === "loading")
    return <Text ta="center">Loading...</Text>;

  if (!session) return null;

  const role = session.user.role;

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1e2f, #302b63, #24243e)",
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
        paddingRight:"20px",
        paddingBottom:"390px",
      }}
    >
      <Card
        shadow="xl"
        radius="22px"
        padding="28px"
        style={{
          width: 420,
          backdropFilter: "blur(18px)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "white",
          padding:"21px"
        }}
      >
        <Stack gap="lg">

          <Text
            ta="center"
            fw={800}
            style={{
              fontSize: "18px",
              letterSpacing: "1px",
            }}
          >
            {role} PANEL
          </Text>

          <Stack gap="md">

            {/* PRODUCT OWNER */}
            {role === "PRODUCT_OWNER" && (
              <>
                <Button
                  fullWidth
                  radius="xl"
                  style={{
                    background:
                      activeButton === "dashboard"
                        ? "linear-gradient(90deg,#ff9a9e,#fad0c4)"
                        : "rgba(255,255,255,0.15)",
                    color:
                      activeButton === "dashboard" ? "#222" : "white",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setActiveButton("dashboard");
                    router.push("/dashboard");
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  fullWidth
                  radius="xl"
                  style={{
                    background:
                      activeButton === "organization"
                        ? "linear-gradient(90deg,#a18cd1,#fbc2eb)"
                        : "rgba(255,255,255,0.15)",
                    color:
                      activeButton === "organization" ? "#222" : "white",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setActiveButton("organization");
                    router.push("/organization");
                  }}
                >
                  Organization
                </Button>
              </>
            )}

            {/* ADMIN */}
            {role === "ADMIN" && (
              <>
                <Button
                  fullWidth
                  radius="xl"
                  style={{
                    background:
                      activeButton === "dashboard"
                        ? "linear-gradient(90deg,#ff9a9e,#fad0c4)"
                        : "rgba(255,255,255,0.15)",
                    color:
                      activeButton === "dashboard" ? "#222" : "white",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setActiveButton("dashboard");
                    router.push("/dashboard");
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  fullWidth
                  radius="xl"
                  style={{
                    background:
                      activeButton === "admin"
                        ? "linear-gradient(90deg,#f6d365,#fda085)"
                        : "rgba(255,255,255,0.15)",
                    color:
                      activeButton === "admin" ? "#222" : "white",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setActiveButton("admin");
                    router.push("/admin");
                  }}
                >
                  Admin Panel
                </Button>

                <Button
                  fullWidth
                  radius="xl"
                  style={{
                    background:
                      activeButton === "user"
                        ? "linear-gradient(90deg,#84fab0,#8fd3f4)"
                        : "rgba(255,255,255,0.15)",
                    color:
                      activeButton === "user" ? "#222" : "white",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setActiveButton("user");
                    router.push("/user");
                  }}
                >
                  Admin Gallery
                </Button>
              </>
            )}

            {/* USER */}
            {role === "USER" && (
              <>
                <Button
                  fullWidth
                  radius="xl"
                  style={{
                    background:
                      activeButton === "dashboard"
                        ? "linear-gradient(90deg,#ff9a9e,#fad0c4)"
                        : "rgba(255,255,255,0.15)",
                    color:
                      activeButton === "dashboard" ? "#222" : "white",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setActiveButton("dashboard");
                    router.push("/dashboard");
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  fullWidth
                  radius="xl"
                  style={{
                    background:
                      activeButton === "user"
                        ? "linear-gradient(90deg,#84fab0,#8fd3f4)"
                        : "rgba(255,255,255,0.15)",
                    color:
                      activeButton === "user" ? "#222" : "white",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setActiveButton("user");
                    router.push("/user");
                  }}
                >
                  User Page
                </Button>
              </>
            )}

          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}