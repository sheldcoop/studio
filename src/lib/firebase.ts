
import { initializeApp, getApps, getApp } from "firebase/app";

const getFirebaseConfig = () => {
  // During build on Firebase App Hosting, process.env.FIREBASE_WEBAPP_CONFIG is available.
  if (process.env.FIREBASE_WEBAPP_CONFIG) {
    return JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
  }

  // When deployed to Firebase App Hosting, the config is injected into the window.
  // This check is for client-side rendering.
  if (typeof window !== 'undefined' && (window as any).FIREBASE_WEBAPP_CONFIG) {
    return (window as any).FIREBASE_WEBAPP_CONFIG;
  }

  // For local development, fall back to NEXT_PUBLIC_ environment variables.
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
};

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
// We add a check to see if the app is already initialized to prevent errors in Next.js's hot-reloading environment.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
