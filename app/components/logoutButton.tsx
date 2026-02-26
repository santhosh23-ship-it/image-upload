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
      style={{
        backgroundColor: "#5c4033", // dark brown
        color: "white",
        fontWeight: 600,
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "#4b2e2b"; // hover dark
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "#5c4033"; // normal
      }}
    >
      Logout
    </Button>
  );
}