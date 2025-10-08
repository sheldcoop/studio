import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// IMPORTANT: Do not use this in client-side code.
// This is the server-side Firebase Admin SDK.

let adminApp: App;

if (getApps().some(app => app.name === 'admin')) {
  adminApp = getApps().find(app => app.name === 'admin')!;
} else {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  }, 'admin');
}

const adminAuth: Auth = getAuth(adminApp);
const adminDb: Firestore = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
