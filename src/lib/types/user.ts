import type { Document } from 'mongoose'

export interface User {
  email: string
  name?: string
  password?: string
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
  role?: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
  emailVerified?: Date | null
  createdAt: Date
  updatedAt: Date
  assignedZipCodes?: Array<{
    zipCode: string
    purchaseDate: Date
    active: boolean
  }>
}

export interface UserDocument extends Document, User {
  _id: string
  __v: number
} 