import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export async function sessionMiddleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  
  // Check if the request is for an API route or auth-related page
  if (req.nextUrl.pathname.startsWith('/api/auth') || 
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/register')) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check session timeout
  const sessionTimeout = token.sessionTimeout || 30 * 60 * 1000; // 30 minutes default
  const lastActivity = token.lastActivity || Date.now();
  
  if (typeof lastActivity === 'number' && Date.now() - lastActivity > sessionTimeout) {
    // Clear session and redirect to login
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('next-auth.session-token');
    return response;
  }

  // Update last activity
  const response = NextResponse.next();
  response.cookies.set('lastActivity', Date.now().toString());
  
  return response;
} 