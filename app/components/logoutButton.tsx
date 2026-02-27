"use client";

import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      radius="xl"
      style={{
        background: "linear-gradient(90deg, #a18cd1, #fbc2eb)",
        color: "#1e1e2f",
        fontWeight: 600,
        padding: "8px 22px",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(90deg, #8f6ed5, #e0aaff)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(90deg, #a18cd1, #fbc2eb)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      Logout
    </Button>
  );
}