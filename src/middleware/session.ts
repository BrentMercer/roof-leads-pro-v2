import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REMEMBER_ME_SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 days

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

  // Determine session timeout based on rememberMe setting
  const sessionTimeout = token.rememberMe ? REMEMBER_ME_SESSION_TIMEOUT : DEFAULT_SESSION_TIMEOUT;
  const lastActivity = token.lastActivity || Date.now();
  const timeSinceLastActivity = Date.now() - lastActivity;
  
  // Debug logging
  console.log('Session Debug:', {
    rememberMe: token.rememberMe,
    sessionTimeout: sessionTimeout / 1000 / 60, // in minutes
    timeSinceLastActivity: timeSinceLastActivity / 1000 / 60, // in minutes
    timeUntilExpiry: (sessionTimeout - timeSinceLastActivity) / 1000 / 60, // in minutes
  });
  
  if (typeof lastActivity === 'number' && timeSinceLastActivity > sessionTimeout) {
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