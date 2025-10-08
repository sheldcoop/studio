import { getApps, initializeApp, cert, getApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// IMPORTANT: Do not use this in client-side code.
// This is the server-side Firebase Admin SDK.

let adminApp: App;
let adminAuth: Auth;
let adminFirestore: Firestore;

function initializeFirebaseAdmin() {
  if (!getApps().length) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    adminApp = getApp();
  }
  adminAuth = getAuth(adminApp);
  adminFirestore = getFirestore(adminApp);
  return { adminApp, adminAuth, adminFirestore };
}

export { initializeFirebaseAdmin };
