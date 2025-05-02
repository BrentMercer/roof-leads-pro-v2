import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { generateTokenWithExpiry } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/email';
import { passwordResetRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success, reset } = await passwordResetRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          message: `Too many requests. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
        },
        { status: 429 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const { token: resetToken, expires: resetTokenExpires } = generateTokenWithExpiry(1); // 1 hour expiry

    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive a password reset link.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 