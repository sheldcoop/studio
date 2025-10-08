import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

const protectedRoutes = ['/', '/paths', '/quantlab', '/interview-prep', '/community'];
const publicRoutes = ['/login'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req.cookies, sessionOptions);
  
  const path = req.nextUrl.pathname;
  let isProtectedRoute = protectedRoutes.some(p => path.startsWith(p)) && path !== '/';
  if (path === '/') isProtectedRoute = true;
  
  const isPublicRoute = publicRoutes.some(p => path.startsWith(p));

  if (isProtectedRoute && !session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && session.isLoggedIn && !req.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return res;
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'],
};
