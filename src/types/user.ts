export type UserRole = 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'

export interface AssignedZipCode {
  zipCode: string
  purchaseDate: Date
  active: boolean
}

export interface User {
  _id: string
  name?: string
  email: string
  password?: string
  emailVerified?: Date
  image?: string
  resetToken?: string | null
  resetTokenExpiry?: Date | null
  verificationToken?: {
    token: string
    expires: Date
  }
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
  tempTwoFactorSecret?: string
  backupCodes?: string[]
  role: UserRole
  assignedZipCodes?: AssignedZipCode[]
  createdAt: Date
  updatedAt: Date
  __v?: number
} 