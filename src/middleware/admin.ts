import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export async function adminMiddleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  
  // Check if user is authenticated and is an admin
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '!/admin/login',
  ],
}; 