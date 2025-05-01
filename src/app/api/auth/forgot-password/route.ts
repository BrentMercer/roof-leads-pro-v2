import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Generate reset token even if user not found (to prevent email enumeration)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    if (user) {
      // Update user with reset token
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(resetTokenExpiry);
      await user.save();

      // Send reset email
      await sendPasswordResetEmail(email, resetToken);
    }

    // Always return success (even if user not found) to prevent email enumeration
    return NextResponse.json({
      message: 'If an account exists with that email, you will receive password reset instructions.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 