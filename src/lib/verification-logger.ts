import { VerificationLog } from '@/lib/models/verification-log'
import { headers } from 'next/headers'

export type VerificationType = 'SEND' | 'VERIFY' | 'RESEND'
export type VerificationStatus = 'SUCCESS' | 'FAILURE'

interface LogVerificationParams {
  userId: string
  type: VerificationType
  status: VerificationStatus
  error?: string
  req?: Request
}

export async function logVerificationAttempt({
  userId,
  type,
  status,
  error,
  req
}: LogVerificationParams) {
  try {
    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await VerificationLog.create({
      userId,
      type,
      status,
      ipAddress,
      userAgent,
      error
    })
  } catch (error) {
    console.error('Failed to log verification attempt:', error)
  }
}

export async function getVerificationAttempts(userId: string) {
  return VerificationLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('userId', 'email name')
    .lean()
} 