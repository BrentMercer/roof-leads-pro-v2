import { NextResponse } from 'next/server';
import { 
  loginRateLimit,
  registrationRateLimit,
  passwordResetRateLimit,
  globalApiRateLimit
} from '@/lib/rate-limit';

export async function authRateLimitMiddleware(req: Request) {
  const path = new URL(req.url).pathname;
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // Apply global rate limit to all requests
  const globalLimit = await globalApiRateLimit.limit(ip);
  if (!globalLimit.success) {
    return rateLimitResponse(globalLimit);
  }

  // Apply specific rate limits based on endpoint
  let rateLimit;
  switch (path) {
    case '/api/auth/login':
      rateLimit = await loginRateLimit.limit(ip);
      break;
    case '/api/auth/register':
      rateLimit = await registrationRateLimit.limit(ip);
      break;
    case '/api/auth/forgot-password':
    case '/api/auth/reset-password':
      rateLimit = await passwordResetRateLimit.limit(ip);
      break;
    default:
      return NextResponse.next();
  }

  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit);
  }

  return NextResponse.next();
}

function rateLimitResponse(rateLimit: { reset: number }) {
  return NextResponse.json(
    {
      message: `Too many requests. Please try again in ${Math.ceil((rateLimit.reset - Date.now()) / 1000)} seconds.`,
      retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000),
    },
    {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
      },
    }
  );
} 