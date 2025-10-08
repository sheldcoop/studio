// src/lib/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

// Your web app's Firebase configuration
// This is a public configuration and is safe to be exposed on the client side.
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "quantprep-backend.firebaseapp.com",
  projectId: "quantprep-backend",
  storageBucket: "quantprep-backend.appspot.com",
  messagingSenderId: "740391494917",
  appId: "1:740391494917:web:0d357038f729227f717709"
};


// Initialize Firebase
// We add a check to see if the app is already initialized to prevent errors in Next.js's hot-reloading environment.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
