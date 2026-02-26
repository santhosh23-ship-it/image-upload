"use client";

import { useEffect, useRef } from "react";
import { firestore } from "@/lib/firebaseClient";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

type NotificationType = {
  message: string;
  createdAt: any;
  isRead: boolean;
};

type Props = { userId: string };

export default function NotificationsComponent({ userId }: Props) {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(firestore, "notifications"),
      where("receiverId", "==", userId),
      where("isRead", "==", false),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return; // skip old notifications
      }

      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data() as NotificationType;

          alert(`🔔 New Notification:\n\n${data.message}`);

          await updateDoc(doc(firestore, "notifications", change.doc.id), {
            isRead: true,
          });
        }
      });
    });

    return () => unsubscribe();
  }, [userId]);

  return null;
}