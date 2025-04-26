import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { NextAuthOptions, DefaultSession } from "next-auth"
import { Adapter } from "next-auth/adapters"
import { clientPromise } from "@/lib/mongodb"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"
import { headers } from 'next/headers'

// Define User schema for authentication
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  emailVerified: Date,
  image: String,
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["USER", "SUPER_ADMIN", "SUB_ADMIN"], default: "USER" },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  tempTwoFactorSecret: String,
  backupCodes: [String],
  lastLogin: Date,
  activeSessions: [
    {
      deviceInfo: String,
      lastActive: Date
    }
  ]
})

// Create or get the User model
const User = mongoose.models.User || mongoose.model("User", UserSchema)

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    role: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
    remember?: boolean
  }
  interface Session {
    user: {
      id: string
      role: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
    } & DefaultSession["user"]
    maxAge?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
    remember?: boolean
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "checkbox" }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required')
          }

          await connectDB()
          
          const user = await User.findOne({ email: credentials.email })

          if (!user || !user.password) {
            throw new Error('No account found with this email')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            throw new Error('Invalid password')
          }

          if (!user.emailVerified) {
            throw new Error('Please verify your email before logging in')
          }

          // Update last login timestamp
          await User.findByIdAndUpdate(user._id, {
            lastLogin: new Date(),
            $addToSet: { activeSessions: { 
              deviceInfo: headers().get('user-agent') || 'Unknown',
              lastActive: new Date()
            }}
          })

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            remember: credentials.remember === 'true'
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        // Set session expiry based on "remember me"
        token.remember = user.remember
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role as 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
      }
      // Set session maxAge based on "remember me"
      if (!token.remember) {
        session.maxAge = 2 * 60 * 60 // 2 hours for normal sessions
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
} 