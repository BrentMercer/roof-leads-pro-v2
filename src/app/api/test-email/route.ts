import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';

export async function GET() {
  try {
    const testEmail = 'test@example.com';
    const testToken = 'test-token-123';
    
    await sendVerificationEmail(testEmail, testToken);
    
    return NextResponse.json(
      { message: 'Test email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { message: 'Failed to send test email', error: error.message },
      { status: 500 }
    );
  }
} 