import { NextRequest, NextResponse } from 'next/server';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { getSession, type SessionData } from '@/lib/session';

// Initialize Firebase client app
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const auth = getAuth();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const session = await getSession();
    session.uid = user.uid;
    session.email = user.email;
    session.displayName = user.displayName;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true, user: { uid: user.uid, email: user.email, displayName: user.displayName } });
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred.';
    switch (error.code) {
      case 'auth/invalid-email':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many requests. Please try again later.';
        break;
    }
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
