import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('next-auth.session-token') || req.cookies.get('next-auth.csrf-token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Parse the token and check the user's role (assuming user role is stored in the session)
  const session = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
    headers: { Cookie: req.headers.get("cookie") || "" },
  }).then((res) => res.json());

  const userIsAdmin = session?.user?.role === 'admin';
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  // If user is not an admin and tries to access an admin route, redirect them
  if (isAdminRoute && !userIsAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
//@ts-ignore
  return withAuth(req);
}

export const config = {
  matcher: ['/dashboard', '/admin/:path*'], // Apply to dashboard and all admin routes
};
