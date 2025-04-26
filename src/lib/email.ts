import { passwordResetTemplate } from './email-templates'
import { verificationEmailTemplate } from './email-templates'
import { sendGHLEmail } from './ghl-api'
import nodemailer from 'nodemailer'

// Debug environment variables
const emailConfig = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "df467f1cf6906e",
    pass: "717cf3d2047ea4"
  }
}

console.log('Email Config:', {
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.auth.user ? '[SET]' : '[NOT SET]',
    pass: emailConfig.auth.pass ? '[SET]' : '[NOT SET]'
  }
})

// Create reusable transporter object
const transporter = nodemailer.createTransport(emailConfig)

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Mailtrap connection error:', error)
  } else {
    console.log('Mailtrap connection verified ✉️')
  }
})

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
        <p style="color: #666;">You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 24 hours. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

export async function sendVerificationEmail(email: string, token: string) {
  console.log('Attempting to send verification email to:', email)
  console.log('Using verification token:', token)
  
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
  console.log('Verification URL:', verificationUrl)

  try {
    const info = await transporter.sendMail({
      from: 'noreply@example.com',  // Hardcoded for testing
      to: email,
      subject: 'Verify your email address',
      html: `
        <div>
          <h1>Verify your email address</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </div>
      `,
    })

    console.log('Verification email sent successfully:', info.messageId)
    return true
  } catch (error) {
    console.error('Failed to send verification email:', error)
    // Don't throw the error - we want registration to succeed even if email fails
    return false
  }
} 