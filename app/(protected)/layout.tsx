"use client";

import { AppShell } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Topbar from "@/app/components/Topbar";
import AppNavbar from "@/app/components/AppNavbar";
import Sidebar from "@/app/components/Sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { status, data: session } = useSession();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) return null; // safe early return

  const isAdmin = session.user?.role === "ADMIN";

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 768 }} // ✅ breakpoint added
    >
      {/* Top header */}
      <AppShell.Header>
        <Topbar />
      </AppShell.Header>

      {/* Single Navbar with both components */}
      <AppShell.Navbar>
        
        <Sidebar />
      </AppShell.Navbar>

      {/* Main content */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}