import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import type { UserDocument } from '@/lib/types/user'

interface VerificationToken {
  token: string
  expires: Date
}

interface ZipCodeAssignment {
  zipCode: string
  purchaseDate: Date
  active: boolean
  source: 'PURCHASE' | 'ADMIN_ASSIGN' | 'GIFT'
}

// Define user schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  emailVerified: Date,
  image: String,
  resetToken: String,
  resetTokenExpiry: Date,
  verificationToken: {
    token: String,
    expires: Date
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  tempTwoFactorSecret: String,
  backupCodes: [String],
  role: {
    type: String,
    enum: ['USER', 'SUPER_ADMIN', 'SUB_ADMIN'],
    default: 'USER'
  },
  assignedZipCodes: [{
    zipCode: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    source: { 
      type: String, 
      enum: ['PURCHASE', 'ADMIN_ASSIGN', 'GIFT'],
      default: 'PURCHASE'
    }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Add indexes
UserSchema.index({ email: 1 }, { unique: true })

// Model
const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema)

// Helper functions with proper typing
export const findUnique = async (where: { id?: string; email?: string }) => {
  await connectDB()
  if (where.id) {
    return User.findById(where.id).lean().exec()
  }
  return User.findOne(where).lean().exec()
}

export const findMany = async (query: {
  select?: Record<string, number>
  where?: Record<string, any>
  orderBy?: Record<string, 1 | -1>
  skip?: number
  take?: number
}) => {
  await connectDB()
  let mongoQuery = User.find()

  if (query.select) {
    mongoQuery = mongoQuery.select(query.select)
  }

  if (query.where) {
    mongoQuery = mongoQuery.where(query.where)
  }

  if (query.orderBy) {
    mongoQuery = mongoQuery.sort(query.orderBy)
  }

  if (query.skip) {
    mongoQuery = mongoQuery.skip(query.skip)
  }

  if (query.take) {
    mongoQuery = mongoQuery.limit(query.take)
  }

  return mongoQuery.lean().exec()
}

export const findFirst = async (where: Record<string, any>) => {
  await connectDB()
  return User.findOne(where).lean().exec()
}

export const create = async (data: Partial<UserDocument>) => {
  await connectDB()
  const newUser = new User(data)
  return newUser.save()
}

export const update = async (where: { id?: string; email?: string }, data: Partial<UserDocument>) => {
  await connectDB()
  if (where.id) {
    return User.findByIdAndUpdate(where.id, data, { new: true }).lean().exec()
  }
  return User.findOneAndUpdate(where, data, { new: true }).lean().exec()
}

export const deleteUser = async (where: { id?: string; email?: string }) => {
  await connectDB()
  if (where.id) {
    return User.findByIdAndDelete(where.id).lean().exec()
  }
  return User.findOneAndDelete(where).lean().exec()
}

export const addZipCode = async (userId: string, zipCode: string) => {
  await connectDB()
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        assignedZipCodes: {
          zipCode,
          purchaseDate: new Date(),
          active: true,
          source: 'PURCHASE'
        }
      }
    },
    { new: true }
  ).lean().exec()
}

export const removeZipCode = async (userId: string, zipCode: string) => {
  await connectDB()
  return User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        assignedZipCodes: { zipCode }
      }
    },
    { new: true }
  ).lean().exec()
}

export const deactivateZipCode = async (userId: string, zipCode: string) => {
  await connectDB()
  return User.findOneAndUpdate(
    {
      _id: userId,
      'assignedZipCodes.zipCode': zipCode
    },
    {
      $set: {
        'assignedZipCodes.$.active': false
      }
    },
    { new: true }
  ).lean().exec()
}

export const getUsersByZipCode = async (zipCode: string) => {
  await connectDB()
  return User.find({
    'assignedZipCodes.zipCode': zipCode,
    'assignedZipCodes.active': true
  }).lean().exec()
}

export { User } 