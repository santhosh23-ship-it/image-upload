"use client";

import { AppShell } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Topbar from "@/app/components/Topbar";
import AppNavbar from "@/app/components/AppNavbar";
import Sidebar from "@/app/components/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data: session } = useSession();
  const router = useRouter();

  // ✅ useEffect is always called
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") return null; // still safe to return early

  if (!session) return null; // wait for redirect

  const isAdmin = session.user?.role === "ADMIN";

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 260 }}>
      <AppShell.Header>
        <Topbar />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppNavbar />
      </AppShell.Navbar>

      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
    
  );
}