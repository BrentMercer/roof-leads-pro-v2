import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { findUnique, update } from '@/lib/models/user'

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is super admin
    const currentUser = await findUnique({ email: session.user.email })

    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { userId } = params

    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Update user with new password
    await update({ id: userId }, {
      password: hashedPassword
    })

    // In a real app, you'd send an email with the temporary password
    return NextResponse.json({
      message: 'Password reset successful',
      temporaryPassword: tempPassword // Only for development!
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}

// Endpoint to complete the password reset
export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { token, newPassword } = await req.json()
    const { userId } = params

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find user with valid reset token
    const user = await findUnique({
      id: userId,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password and clear reset token
    await update({ id: userId }, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    })

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
} 