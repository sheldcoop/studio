import { initializeApp, getApps, getApp } from "firebase/app";

const getFirebaseConfig = () => {
  // Hardcoded config for production
  const productionConfig = {
    apiKey: "AIzaSyCOhU2Tg9lj6e_MlqrFQdPEgoZ_Kw8VyWU",
    authDomain: "studio-9175235396-fa433.firebaseapp.com",
    projectId: "studio-9175235396-fa433",
    storageBucket: "studio-9175235396-fa433.firebasestorage.app",
    messagingSenderId: "544052929385",
    appId: "1:544052929385:web:17d9d296c4c55ee9ecd3f8",
  };

  // For local development, try env vars first
  if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
  }

  return productionConfig;
};

const firebaseConfig = getFirebaseConfig();

console.log('Firebase config:', { 
  hasApiKey: !!firebaseConfig.apiKey,
  projectId: firebaseConfig.projectId,
  apiKeyLength: firebaseConfig.apiKey?.length
});

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };