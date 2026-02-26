"use client";

import { Group } from "@mantine/core";
import LogoutButton from "./logoutButton";

export default function AppNavbar() {
  return (
    <Group justify="space-between" px="lg" py="sm">
      <div></div>
      <LogoutButton />
    </Group>
  );
}
