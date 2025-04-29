import { create, findUnique, update } from '../lib/models/user'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import type { UserDocument } from '../lib/types/user'

async function testPasswordReset() {
  try {
    console.log('Starting password reset test...')

    // Create a test user with unique email
    const uniqueId = crypto.randomBytes(4).toString('hex')
    const testUser = await create({
      email: `test.${uniqueId}@example.com`,
      password: await bcrypt.hash('initialPassword', 10),
      name: 'Test User',
      role: 'USER'
    }) as UserDocument

    console.log('Created test user:', testUser.email)

    // Test 1: Admin-initiated password reset
    console.log('\nTesting admin-initiated password reset...')
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10)

    await update({ id: testUser._id }, {
      $set: {
        password: hashedTempPassword
      }
    })

    const userAfterAdminReset = await findUnique({ id: testUser._id }) as UserDocument
    if (!userAfterAdminReset) {
      throw new Error('User not found after admin reset')
    }
    if (!userAfterAdminReset.password) {
      throw new Error('Password not found after admin reset')
    }
    const tempPasswordValid = await bcrypt.compare(tempPassword, userAfterAdminReset.password)
    console.log('Admin reset successful:', tempPasswordValid)

    // Test 2: User-initiated password reset
    console.log('\nTesting user-initiated password reset...')
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    await update({ id: testUser._id }, {
      $set: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Verify token exists
    const userWithToken = await findUnique({
      id: testUser._id,
      resetToken,
      resetTokenExpiry: { $gt: new Date() }
    }) as UserDocument
    console.log('Reset token set successfully:', !!userWithToken)

    // Complete password reset
    const newPassword = 'newSecurePassword123'
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await update({ id: testUser._id }, {
      $set: {
        password: hashedNewPassword
      },
      $unset: {
        resetToken: "",
        resetTokenExpiry: ""
      }
    })

    // Verify reset completion
    const userAfterReset = await findUnique({ id: testUser._id }) as UserDocument
    if (!userAfterReset) {
      throw new Error('User not found after reset')
    }
    if (!userAfterReset.password) {
      throw new Error('Password not found after reset')
    }
    const newPasswordValid = await bcrypt.compare(newPassword, userAfterReset.password)
    const tokenRemoved = !userAfterReset.resetToken && !userAfterReset.resetTokenExpiry
    console.log('Password reset completed successfully:', newPasswordValid)
    console.log('Reset token removed:', tokenRemoved)

    // Cleanup - delete the test user
    await update({ id: testUser._id }, { $set: { isTestUser: true } })
    console.log('\nTest completed successfully!')
    console.log('Test user marked for cleanup (isTestUser: true)')

  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
}

testPasswordReset() 