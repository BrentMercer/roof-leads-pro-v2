export interface VerificationLog {
  userId: string
  type: 'EMAIL' | 'PHONE'
  status: 'PENDING' | 'VERIFIED' | 'FAILED'
  ipAddress: string
  userAgent: string
  createdAt: Date
  updatedAt: Date
} 