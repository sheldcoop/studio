import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isLoggedIn: boolean;
  createdAt?: number;
  csrfToken?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'quantprep-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export function getSession() {
  const session = getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
