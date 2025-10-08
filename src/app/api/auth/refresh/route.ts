import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(idToken, true);
    
    // Update session timestamp
    const session = await getSession();
    if (session.uid === decodedToken.uid) {
      session.createdAt = Date.now();
      await session.save();
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Session mismatch' }, { status: 401 });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
