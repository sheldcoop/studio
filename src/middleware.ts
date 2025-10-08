import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

const protectedRoutes = ['/', '/paths', '/quantlab', '/interview-prep', '/community'];
const publicRoutes = ['/login', '/signup', '/reset-password'];

export async function middleware(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const path = req.nextUrl.pathname;

  // Check if session has expired
  if (session.isLoggedIn && session.createdAt) {
    const sessionAge = Date.now() - session.createdAt;
    const MAX_SESSION_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (sessionAge > MAX_SESSION_AGE) {
      session.destroy();
      const response = NextResponse.redirect(new URL('/login', req.nextUrl));
      // Manually clear the cookie as session.destroy() might not be enough on redirect
      response.cookies.delete(sessionOptions.cookieName);
      return response;
    }
  }

  const isPublicRoute = publicRoutes.some(p => path.startsWith(p));
  const isProtectedRoute = path === '/' || protectedRoutes.some(p => p !== '/' && path.startsWith(p));

  // If user is logged in and tries to access a public-only route (like login), redirect to dashboard
  if (session.isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // If user is not logged in and tries to access a protected route, redirect to login
  if (!session.isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico|auth/verify-email).*)'],
};
