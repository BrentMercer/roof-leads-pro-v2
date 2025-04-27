import type { Document } from 'mongoose'

export interface User {
  email: string
  name?: string
  password?: string
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
  role?: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
}

export interface UserDocument extends Document {
  email: string
  name?: string
  password?: string
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
  role?: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
  _id: string
  __v: number
} 