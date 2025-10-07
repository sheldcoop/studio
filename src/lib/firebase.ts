// src/lib/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

// Your web app's Firebase configuration
// This is a public configuration and is safe to be exposed on the client side.
const firebaseConfig = {
  apiKey: "AIzaSyCOhU2Tg9lj6e_MlqrFQdPEgoZ_Kw8VyWU",
  authDomain: "studio-9175235396-fa433.firebaseapp.com",
  projectId: "studio-9175235396-fa433",
  storageBucket: "studio-9175235396-fa433.appspot.com",
  messagingSenderId: "544052929385",
  appId: "1:544052929385:web:17d9d296c4c55ee9ecd3f8"
};


// Initialize Firebase
// We add a check to see if the app is already initialized to prevent errors in Next.js's hot-reloading environment.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
