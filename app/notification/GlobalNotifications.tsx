// app/components/GlobalNotifications.tsx
"use client";

import { useSession } from "next-auth/react";
import Notifications from "./Notification";

export default function GlobalNotifications() {
  const { data: session } = useSession();
  if (!session?.user?.id) return null;

  return <Notifications userId={session.user.id} />;
}