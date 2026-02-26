// lib/firebase.ts
"use client";

import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken as firebaseGetToken } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const firestore = getFirestore(app);

// ✅ Only initialize messaging in browser
let messaging: ReturnType<typeof getMessaging> | null = null;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

// ✅ Wrap getToken in client-only function
export async function getFCMToken() {
  if (typeof window === "undefined") return null;
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return null;
    }

    const token = await firebaseGetToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (err) {
    console.error("FCM getToken error:", err);
    return null;
  }
}



export { messaging, firestore };
