import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { NextAuthOptions, DefaultSession } from "next-auth"
import { clientPromise } from "@/lib/mongodb"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"

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
  backupCodes: [String]
})

// Create or get the User model
const User = mongoose.models.User || mongoose.model("User", UserSchema)

declare module "next-auth" {
  interface User {
    role: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
  }
  interface Session {
    user: {
      id: string
      role: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
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

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role
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
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role as 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
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