import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

const { adminAuth, adminFirestore } = initializeFirebaseAdmin();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, displayName } = body;

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    });
    
    // Also save user profile to Firestore
    const userRef = doc(adminFirestore, 'users', userRecord.uid);
    await setDoc(userRef, {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL || null,
    }, { merge: true });


    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'An account with this email already exists.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'The password must be at least 6 characters long.';
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
