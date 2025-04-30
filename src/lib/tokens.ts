import crypto from 'crypto';

/**
 * Generates a random token for email verification
 * @returns A 32-byte random hexadecimal string
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a token with expiration
 * @returns Object containing token and expiration date
 */
export function generateTokenWithExpiry(hours: number = 24): { token: string; expires: Date } {
  const token = generateToken();
  const expires = new Date();
  expires.setHours(expires.getHours() + hours);
  
  return { token, expires };
} 