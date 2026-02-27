// app/components/Notifications.tsx
"use client";

import { useEffect, useRef } from "react";
import { firestore } from "@/lib/firebaseClient";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { notifications } from "@mantine/notifications";

type Props = { userId: string };

export default function Notifications({ userId }: Props) {
  const shownIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(firestore, "notifications"),
      where("receiverId", "==", userId),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === "added") {
          const docId = change.doc.id;
          if (shownIds.current.has(docId)) return;
          shownIds.current.add(docId);

          const data = change.doc.data();

          // Show notification with image
          notifications.show({
            title: "🔔 Notification",
            message: (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {data.imageUrl && (
                  <img src={data.imageUrl} alt="Image" width={50} height={50} style={{ borderRadius: 4 }} />
                )}
                <span>{data.message}</span>
              </div>
            ),
            color: "blue",
            autoClose: 1000, // 1 second
          });

          // Mark as read
          await updateDoc(doc(firestore, "notifications", docId), { isRead: true });
        }
      });
    });

    return () => unsubscribe();
  }, [userId]);

  return null;
}