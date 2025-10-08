import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/firebase/admin';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, phoneNumber } = body;

    if (!idToken || !phoneNumber) {
      return NextResponse.json(
        { error: 'ID token and phone number are required' },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user details
    const userRecord = await adminAuth.getUser(uid);

    // Create or update user in Firestore
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || `User ${uid.slice(0, 5)}`,
        photoURL: userRecord.photoURL || null,
        phoneNumber: userRecord.phoneNumber,
        provider: 'phone',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await userRef.update({
        updatedAt: new Date().toISOString(),
        phoneNumber: userRecord.phoneNumber,
      });
    }

    // Create session
    const session = await getSession();
    session.uid = userRecord.uid;
    session.email = userRecord.email || null;
    session.displayName = userRecord.displayName || `User ${uid.slice(0, 5)}`;
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
    console.error('Phone verification error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired phone verification code' },
      { status: 401 }
    );
  }
}
