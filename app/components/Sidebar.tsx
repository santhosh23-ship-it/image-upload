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

    if (pathname.includes("/organization")) setActiveButton("organization");
    else if (pathname.includes("/dashboard")) setActiveButton("orgDashboard");

    else if (pathname.includes("/admin/dashboard")) setActiveButton("admin");
    else if (pathname.includes("/user/dashboard") && !pathname.includes("/admin")) setActiveButton("userManagement");
    else if (pathname.includes("/admin/gallery")) setActiveButton("adminGallery");

    else if (pathname.includes("/user/dashboard") && !pathname.includes("/admin")) setActiveButton("user");
    else if (pathname.includes("/user/gallery")) setActiveButton("userGallery");
  }, [pathname]);

  if (status === "loading") return <Text ta="center">Loading...</Text>;
  if (!session) return null;

  const role = session.user.role;
  const userId = session.user.id;

  // Helper to style buttons — active = filled, inactive = outline
  const getButtonStyle = (name: string) => {
    if (activeButton === name) {
      return {
        backgroundColor: "#5c4033",
        color: "white",
        fontWeight: 600,
      };
    }
    return {
      border: "2px solid #5c4033",
      color: "#5c4033",
      fontWeight: 600,
      backgroundColor: "transparent",
    };
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#faf5ec",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack p="xl" gap="lg" align="center">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#e6ccb2",
          }}
        >
          <Stack gap="sm">

            {/* ================= PRODUCT OWNER ================= */}
            {role === "PRODUCT_OWNER" && (
              <>
                <Text fw={600} ta="center">
                  Product Owner Actions
                </Text>

                
                <Button
                  fullWidth
                  style={getButtonStyle("orgDashboard")}
                  onClick={() => {
                    setActiveButton("orgDashboard");
                    router.push(`/dashboard`);
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  fullWidth
                  style={getButtonStyle("organization")}
                  onClick={() => {
                    setActiveButton("organization");
                    router.push(`/organization`);
                  }}
                >
                  Organization
                </Button>

              </>
            )}

            {/* ================= ADMIN ================= */}
            {role === "ADMIN" && (
              <>
              
                <Text fw={700} ta="center">
                  Admin 
                </Text>
                  
                <Button
                  fullWidth
                  style={getButtonStyle("orgDashboard")}
                  onClick={() => {
                    setActiveButton("orgDashboard");
                    router.push(`/dashboard`);
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  fullWidth
                  style={getButtonStyle("admin")}
                  onClick={() => {
                    setActiveButton("admin");
                    router.push(`/admin`);
                  }}
                >
                  Admin Dashboard
                </Button>

                <Button
                  fullWidth
                  style={getButtonStyle("userManagement")}
                  onClick={() => {
                    setActiveButton("userManagement");
                    router.push(`/user`);
                  }}
                >
                  User 
                </Button>

                <Button
                  fullWidth
                  style={getButtonStyle("adminGallery")}
                  onClick={() => {
                    setActiveButton("adminGallery");
                    router.push(`/admin/gallery/${userId}`);
                  }}
                >
                  Admin Galler
                </Button>
              </>
            )}

            {/* ================= USER ================= */}
            {role === "USER" && (
              <>
                <Text fw={700} ta="center">
                  User Actions
                </Text>
                
                <Button
                  fullWidth
                  style={getButtonStyle("orgDashboard")}
                  onClick={() => {
                    setActiveButton("orgDashboard");
                    router.push(`/dashboard`);
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  fullWidth
                  style={getButtonStyle("user")}
                  onClick={() => {
                    setActiveButton("user");
                    router.push(`/user`);
                  }}
                >
                  User 
                </Button>

                <Button
                  fullWidth
                  style={getButtonStyle("userGallery")}
                  onClick={() => {
                    setActiveButton("userGallery");
                    router.push(`/user/gallery`);
                  }}
                >
                  User Gallery
                </Button>
              </>
            )}

          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}