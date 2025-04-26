import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

// Define User schema if not already defined elsewhere
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  resetToken: String,
  resetTokenExpiry: Date,
})

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email })

    // Don't reveal if user exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link will be sent.'
      })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 3600000) // 24 hours

    // Save reset token to user
    await User.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpiry
    })

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link will be sent.'
    })

  } catch (error) {
    console.error('Forgot Password Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again later.' },
      { status: 500 }
    )
  }
} 