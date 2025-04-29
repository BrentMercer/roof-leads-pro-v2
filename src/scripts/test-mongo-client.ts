import { mongoClient } from '../lib/db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { User } from '../lib/types/user'
import { VerificationLog } from '../lib/types/verification-log'
import { SyncLog } from '../lib/types/sync-log'
import { LeanDocument } from 'mongoose'

type LeanUser = LeanDocument<User & { _id: string; __v: number }>
type LeanVerificationLog = LeanDocument<VerificationLog & { _id: string; __v: number }>
type LeanSyncLog = LeanDocument<SyncLog & { _id: string; __v: number }>

async function testMongoClient() {
  try {
    console.log('Starting MongoDB client test...')

    // Test User operations
    console.log('\nTesting User operations...')
    const uniqueId = crypto.randomBytes(4).toString('hex')
    const testUser = await mongoClient.user.create({
      data: {
        email: `test.${uniqueId}@example.com`,
        password: await bcrypt.hash('initialPassword', 10),
        name: 'Test User',
        role: 'USER'
      }
    }) as LeanUser
    console.log('Created test user:', testUser.email)

    // Test findOne
    const foundUser = await mongoClient.user.findOne({
      where: { email: testUser.email }
    }) as LeanUser | null
    console.log('Found user:', foundUser?.email)

    // Test updateOne
    const updatedUser = await mongoClient.user.updateOne({
      where: { id: testUser._id },
      data: { name: 'Updated Test User' }
    }) as LeanUser | null
    console.log('Updated user name:', updatedUser?.name)

    // Test VerificationLog operations
    console.log('\nTesting VerificationLog operations...')
    const verificationLog = await mongoClient.verificationLog.create({
      data: {
        userId: testUser._id,
        type: 'EMAIL',
        status: 'PENDING',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Client'
      }
    }) as LeanVerificationLog
    console.log('Created verification log:', verificationLog._id)

    // Test find
    const logs = await mongoClient.verificationLog.find({
      where: { userId: testUser._id }
    }) as LeanVerificationLog[]
    console.log('Found verification logs:', logs?.length)

    // Test SyncLog operations
    console.log('\nTesting SyncLog operations...')
    const syncLog = await mongoClient.syncLog.create({
      data: {
        type: 'Full',
        status: 'In Progress',
        startTime: new Date()
      }
    }) as LeanSyncLog
    console.log('Created sync log:', syncLog._id)

    // Test updateOne
    const updatedSyncLog = await mongoClient.syncLog.updateOne({
      where: { id: syncLog._id },
      data: {
        status: 'Success',
        recordsProcessed: 100,
        endTime: new Date()
      }
    }) as LeanSyncLog | null
    console.log('Updated sync log status:', updatedSyncLog?.status)

    // Cleanup
    await mongoClient.user.deleteOne({
      where: { id: testUser._id }
    })
    console.log('\nTest completed successfully!')
    console.log('Test data cleaned up')

  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
}

testMongoClient() 