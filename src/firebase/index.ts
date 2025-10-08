'use client';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { useCollection } from './firestore/use-collection';

// Export hooks
export { useCollection };
export * from './provider';
export { useAuth as useFirebaseAuth } from './provider';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// Memoize initialization
if (typeof window !== 'undefined' && getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
}

export function initializeFirebase() {
  return { firebaseApp, auth, firestore };
}
