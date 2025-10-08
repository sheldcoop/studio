
// This file is being deprecated in favor of the new src/firebase/index.ts structure.
// For backward compatibility, we will keep the app export but move the config.
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app, firebaseConfig };
