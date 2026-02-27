"use client";

import { Group, Title, Box } from "@mantine/core";
import LogoutButton from "./logoutButton";

export default function Topbar() {
  return (
    <Box
      style={{
        width: "100%",
        padding: "14px 24px",
        background: "linear-gradient(90deg, #1e1e2f, #302b63)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      }}
    >
      <Group justify="space-between" align="center">
        <Title
          order={4}
          style={{
            color: "white",
            letterSpacing: "0.5px",
            fontWeight: 700,
          }}
        >
          Image Uploads
        </Title>

        <LogoutButton />
      </Group>
    </Box>
  );
}