import { DefaultSession } from "next-auth"

export type UserRole = 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'

declare module "next-auth" {
  interface User {
    id: string
    role: UserRole
    remember?: boolean
  }
  
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
    maxAge?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    remember?: boolean
  }
} 