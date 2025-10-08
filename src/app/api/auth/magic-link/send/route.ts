import { NextRequest, NextResponse } from 'next/server';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const actionCodeSettings = {
      // URL you want to redirect back to after email link is clicked
      url: `${process.env.NEXT_PUBLIC_APP_URL}/actions?mode=signIn`,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    return NextResponse.json({
      success: true,
      message: 'Magic link sent! Check your email.',
    });
  } catch (error: any) {
    console.error('Magic link error:', error);
    
    let errorMessage = 'Failed to send magic link.';
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later.';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
