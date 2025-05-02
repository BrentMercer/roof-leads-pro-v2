import { NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Check for test header to prevent accidental calls
    const testHeader = request.headers.get('x-test-password-reset');
    if (!testHeader || testHeader !== 'true') {
      return NextResponse.json(
        { message: 'Test endpoint requires x-test-password-reset header' },
        { status: 403 }
      );
    }

    const testEmail = 'test@example.com';
    const testToken = 'test-reset-token-123';
    
    await sendPasswordResetEmail(testEmail, testToken);
    
    return NextResponse.json(
      { 
        message: 'Test password reset email sent successfully',
        email: testEmail,
        token: testToken
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Test password reset error:', error);
    return NextResponse.json(
      { message: 'Failed to send test password reset email', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  // ... existing code ...
} 