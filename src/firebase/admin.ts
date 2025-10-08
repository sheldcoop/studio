
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// IMPORTANT: Do not use this in client-side code.
// This is the server-side Firebase Admin SDK.

let adminApp: App;
let adminAuth: Auth;
let adminFirestore: Firestore;

if (getApps().length === 0) {
    adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
        }),
    });
} else {
    adminApp = getApps()[0];
}

adminAuth = getAuth(adminApp);
adminFirestore = getFirestore(adminApp);

export { adminApp, adminAuth, adminFirestore };
