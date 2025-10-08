import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/firebase/admin';
import { doc, setDoc } from 'firebase/firestore';
import { signupSchema } from '@/lib/validation';
import { handleAuthError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
    }

    const { email, password, displayName } = validation.data;

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    });
    
    const userRef = doc(adminDb, 'users', userRecord.uid);
    await setDoc(userRef, {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL || null,
      provider: 'password',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    logger.info('User signed up', { uid: userRecord.uid });
    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: any) {
    const { error: errorMessage, statusCode } = handleAuthError(error);
    logger.error('Signup failed', { error: errorMessage });
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}