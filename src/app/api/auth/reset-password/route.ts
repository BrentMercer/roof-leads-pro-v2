import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { passwordResetRateLimit } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    console.log('[Password Reset] Processing reset request for token:', token);
    console.log('[Password Reset] New password received:', password);

    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success, reset } = await passwordResetRateLimit.limit(ip);

    if (!success) {
      console.log('[Password Reset] Rate limit exceeded for IP:', ip);
      return NextResponse.json(
        {
          message: `Too many requests. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
        },
        { status: 429 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user with matching reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log('[Password Reset] Invalid or expired token:', token);
      return NextResponse.json(
        { message: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    console.log('[Password Reset] Found user:', user.email);
    console.log('[Password Reset] Current hashed password:', user.password);

    // Update user's password and clear reset token
    user.password = password; // Set the plain password, let the pre-save hook handle hashing
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    console.log('[Password Reset] Password updated successfully for user:', user.email);

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Password Reset] Error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 