"use client";

import { Group, Title, Box } from "@mantine/core";
import LogoutButton from "./logoutButton";

export default function Topbar() {
  return (
    <Box
      style={{
        backgroundColor: "#faf5ec", // 👈 light brown
        width: "100%",
        padding: "8px 16px",
      }}
    >
      <Group justify="space-between">
        <Title order={4}>Image Uploads</Title>
        <LogoutButton />
      </Group>
    </Box>
  );
}