import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

const protectedRoutes = ['/', '/paths', '/quantlab', '/interview-prep', '/community'];
const publicRoutes = ['/login'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req.cookies, sessionOptions);
  
  const path = req.nextUrl.pathname;
  
  const isPublicRoute = publicRoutes.some(p => path.startsWith(p));

  // The root path '/' is a special case. It's protected but also the default landing.
  // The logic needs to handle it carefully. All other protected routes will start with the prefix.
  const isProtectedRoute = protectedRoutes.some(p => path.startsWith(p));
  
  // If the user is on a public route (e.g., /login)
  if (isPublicRoute) {
    // And they are logged in, redirect them away from the login page to the dashboard.
    if (session.isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    // Otherwise, let them stay on the public route.
    return res;
  }

  // If the user is on a protected route
  if (isProtectedRoute) {
    // And they are not logged in, redirect them to the login page.
    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  return res;
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'],
};
