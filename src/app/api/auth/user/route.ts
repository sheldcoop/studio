import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();

  if (session.isLoggedIn) {
    return NextResponse.json({
      user: {
        uid: session.uid,
        email: session.email,
        displayName: session.displayName,
      },
    });
  }

  return NextResponse.json({ user: null }, { status: 401 });
}
