import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'quantprep-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // ADDED - prevents XSS attacks
    sameSite: 'lax' as const, // ADDED - CSRF protection
    maxAge: 60 * 60 * 24 * 7, // ADDED - 7 days expiry
  },
};

export interface SessionData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null; // ADDED
  isLoggedIn: boolean;
  createdAt?: number; // ADDED - for session validation
}

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
