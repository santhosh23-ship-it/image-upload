importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({

  apiKey: "AIzaSyDSlwoZ7O5iBjJR3g-07MScjN2adqyKyfE",
  authDomain: "image-upload-sys.firebaseapp.com",
  projectId: "image-upload-sys",
  storageBucket: "image-upload-sys.firebasestorage.app",
  messagingSenderId: "602894027617",
  appId: "1:602894027617:web:377eeff0c2c7a2cad91320",
  measurementId: "G-T8STJ0H0E2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
   console.log("🔥 Background message received:", payload)
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
