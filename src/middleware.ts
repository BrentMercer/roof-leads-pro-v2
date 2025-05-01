import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { authRateLimitMiddleware } from './middleware/auth-rate-limit';

export default withAuth(
  async function middleware(req) {
    // Apply rate limiting to auth endpoints
    if (req.nextUrl.pathname.startsWith('/api/auth')) {
      return authRateLimitMiddleware(req);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/user/:path*',
  ],
}; 