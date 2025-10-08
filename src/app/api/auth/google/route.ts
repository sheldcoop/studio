import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/firebase/admin';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Verify the Google ID token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user details from Firebase Auth
    const userRecord = await adminAuth.getUser(uid);

    // Create or update user in Firestore
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // First time user - create profile
      await userRef.set({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        provider: 'google.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Existing user - update last login
      await userRef.update({
        updatedAt: new Date().toISOString(),
      });
    }

    // Create session
    const session = await getSession();
    session.uid = userRecord.uid;
    session.email = userRecord.email || null;
    session.displayName = userRecord.displayName || null;
    session.photoURL = userRecord.photoURL || null;
    session.isLoggedIn = true;
    session.createdAt = Date.now();
    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
      },
    });
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 401 }
    );
  }
}
