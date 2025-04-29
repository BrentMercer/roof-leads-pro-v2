import type { Document } from 'mongoose'

export interface VerificationToken {
  token: string
  expires: Date
}

export interface ZipCodeAssignment {
  zipCode: string
  purchaseDate: Date
  active: boolean
  source: 'PURCHASE' | 'ADMIN_ASSIGN' | 'GIFT'
}

export interface User {
  email: string
  name?: string
  password?: string
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
  role?: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
  emailVerified?: Date | null
  image?: string
  resetToken?: string
  resetTokenExpiry?: Date
  verificationToken?: VerificationToken
  tempTwoFactorSecret?: string
  backupCodes?: string[]
  assignedZipCodes?: ZipCodeAssignment[]
  createdAt: Date
  updatedAt: Date
}

export interface UserDocument extends Document, User {
  _id: string
  __v: number
} 