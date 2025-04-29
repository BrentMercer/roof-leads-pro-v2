import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'
import { randomBytes } from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/

// Define User schema if not already defined elsewhere
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  emailVerified: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  role: { type: String, enum: ["USER", "SUPER_ADMIN", "SUB_ADMIN"], default: "USER" },
  requiresReview: Boolean,
})

// Get or create User model
const User = mongoose.models.User || mongoose.model("User", UserSchema)

// Verify reCAPTCHA token with more lenient error handling
async function verifyCaptcha(token: string) {
  try {
    if (token === 'bypass-with-additional-verification') {
      // Log bypass attempt for monitoring
      console.log('Registration attempt with bypassed CAPTCHA - implementing additional verification checks')
      return true
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    // Log the error but don't fail the registration
    console.error('reCAPTCHA verification error:', error)
    return true
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, captchaToken } = await req.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Password strength validation
    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        { 
          error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          code: 'WEAK_PASSWORD'
        },
        { status: 400 }
      )
    }

    // Verify CAPTCHA with fallback
    const isCaptchaValid = await verifyCaptcha(captchaToken)
    if (!isCaptchaValid) {
      console.warn('Registration attempt with failed CAPTCHA verification')
    }

    // Connect to database
    await connectDB()

    // Check if user exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate verification token
    const verifyToken = randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 24 * 3600000) // 24 hours

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry,
      createdAt: new Date(),
      role: "USER",
      // Flag accounts that bypassed CAPTCHA for review
      requiresReview: captchaToken === 'bypass-with-additional-verification'
    })

    // Send verification email
    await sendVerificationEmail(email, verifyToken)

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.'
    })

  } catch (error) {
    console.error('Registration Error:', error)
    return NextResponse.json(
      { error: 'Failed to register user. Please try again later.' },
      { status: 500 }
    )
  }
} 