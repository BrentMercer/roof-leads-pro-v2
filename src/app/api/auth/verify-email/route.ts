import { NextResponse } from 'next/server'
import { findFirst, update } from '@/lib/models/user'
import { checkRateLimit } from '@/lib/rate-limit'
import { logVerificationAttempt } from '@/lib/verification-logger'
import { User } from '@/types/user'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    const rateLimit = await checkRateLimit(`token_verify_${token}`)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Find user with matching verification token
    const user = await findFirst({
      'verificationToken.token': token,
      'verificationToken.expires': { $gt: new Date() }
    }) as User | null

    if (!user) {
      await logVerificationAttempt({
        userId: 'unknown',
        type: 'VERIFY',
        status: 'FAILURE',
        error: 'Invalid or expired token',
        req
      })

      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Update user and clear verification token
    await update(
      { _id: user._id },
      {
        $set: { 
          emailVerified: new Date(),
          verificationToken: null
        }
      }
    )

    await logVerificationAttempt({
      userId: user._id,
      type: 'VERIFY',
      status: 'SUCCESS',
      req
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email Verification Error:', error)
    
    await logVerificationAttempt({
      userId: 'unknown',
      type: 'VERIFY',
      status: 'FAILURE',
      error: error instanceof Error ? error.message : 'Unknown error',
      req
    })

    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    )
  }
} 