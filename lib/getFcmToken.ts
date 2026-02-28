import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebaseClient";

export async function getFcmToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
}