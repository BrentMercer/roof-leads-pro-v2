// Simple in-memory rate limiting for MVP demo
const rateLimits = new Map<string, { count: number; resetTime: number }>();

const createRateLimit = (limit: number, window: number) => {
  return {
    limit: async (identifier: string) => {
      const now = Date.now();
      const key = `${identifier}-${Math.floor(now / window)}`;
      
      const current = rateLimits.get(key) || { count: 0, resetTime: now + window };
      
      if (now > current.resetTime) {
        rateLimits.set(key, { count: 1, resetTime: now + window });
        return { success: true, reset: now + window };
      }
      
      if (current.count >= limit) {
        return { success: false, reset: current.resetTime };
      }
      
      current.count++;
      rateLimits.set(key, current);
      return { success: true, reset: current.resetTime };
    }
  };
};

// Rate limits for MVP demo
export const passwordResetRateLimit = createRateLimit(5, 60 * 60 * 1000); // 5 requests per hour
export const loginRateLimit = createRateLimit(10, 5 * 60 * 1000); // 10 requests per 5 minutes
export const registrationRateLimit = createRateLimit(5, 60 * 60 * 1000); // 5 requests per hour
export const globalApiRateLimit = createRateLimit(200, 60 * 1000); // 200 requests per minute
export const emailVerificationRateLimit = createRateLimit(3, 60 * 60 * 1000); // 3 requests per hour
export const oauthCallbackRateLimit = createRateLimit(10, 60 * 1000); // 10 requests per minute
export const sessionRefreshRateLimit = createRateLimit(10, 60 * 1000); // 10 requests per minute 