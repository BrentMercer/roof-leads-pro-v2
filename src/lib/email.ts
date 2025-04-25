import { passwordResetTemplate } from './email-templates'
import { verificationEmailTemplate } from './email-templates'
import { sendGHLEmail } from './ghl-api'
import nodemailer from 'nodemailer'

// Create reusable transporter object using Mailtrap SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  }
})

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
  const template = passwordResetTemplate(resetUrl)

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset link:', resetUrl)
      
      // Send email through Mailtrap in development
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      })
      
      return true
    }

    await sendGHLEmail({
      to: [email],
      subject: template.subject,
      htmlContent: template.html,
      plainContent: template.text,
    })

    return true
  } catch (error) {
    console.error('Failed to send reset email:', error)
    return false
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
  const template = verificationEmailTemplate(verifyUrl)

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Verification link:', verifyUrl)
      
      // Send email through Mailtrap in development
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify your email address',
        text: template.text,
        html: template.html,
      })
      
      console.log('Verification email sent:', info.messageId)
      return true
    }

    // In production, use GHL
    await sendGHLEmail({
      to: [email],
      subject: 'Verify your email address',
      htmlContent: template.html,
      plainContent: template.text,
    })

    return true
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return false
  }
} 