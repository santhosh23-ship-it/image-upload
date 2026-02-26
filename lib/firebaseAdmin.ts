import admin from "firebase-admin";

// ✅ Initialize only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// Firestore instance
const firestore = admin.firestore();
console.log("✅ Firebase Admin initialized", admin.apps.length);

export { admin, firestore };
export default admin;
