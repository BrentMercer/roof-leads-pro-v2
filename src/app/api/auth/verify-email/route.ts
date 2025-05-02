import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    console.log('Received verification token:', token);

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user with matching verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });
    console.log('Found user:', user ? 'yes' : 'no');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user to mark as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    console.log('User marked as verified');

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: error.message || 'Email verification failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // ... existing code ...
} 