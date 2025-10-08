import { NextRequest, NextResponse } from 'next/server';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { getSession } from '@/lib/session';
import { authLimiter } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validation';
import { handleAuthError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';


// Initialize Firebase client app
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const auth = getAuth();

export async function POST(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';

  try {
    await authLimiter.check(5, `login-${ip}`);

    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
    }
    
    const { email, password } = validation.data;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const session = await getSession();
    session.uid = user.uid;
    session.email = user.email;
    session.displayName = user.displayName;
    session.isLoggedIn = true;
    session.createdAt = Date.now();
    await session.save();

    logger.info('User logged in', { uid: user.uid, method: 'email' });
    return NextResponse.json({ success: true, user: { uid: user.uid, email: user.email, displayName: user.displayName } });
  } catch (error: any) {
     if (error.message === 'Rate limit exceeded') {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }
    const { error: errorMessage, statusCode } = handleAuthError(error);
    logger.error('Login failed', { ip, error: errorMessage });
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}