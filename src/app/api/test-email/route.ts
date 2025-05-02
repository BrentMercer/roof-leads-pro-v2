import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Check for test header to prevent accidental calls
    const testHeader = request.headers.get('x-test-email');
    if (!testHeader || testHeader !== 'true') {
      return NextResponse.json(
        { message: 'Test email endpoint requires x-test-email header' },
        { status: 403 }
      );
    }

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

export async function POST(request: Request) {
  // ... existing code ...
} 