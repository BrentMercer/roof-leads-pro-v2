import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'

// Define verification log schema
const verificationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['SEND', 'VERIFY', 'RESEND'],
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE'],
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  error: {
    type: String
  }
}, {
  timestamps: true
})

// Model
const VerificationLog = mongoose.models.VerificationLog || mongoose.model('VerificationLog', verificationLogSchema)

// Helper functions
const create = async (data: any) => {
  await connectDB()
  const log = new VerificationLog(data)
  return log.save()
}

const findMany = async (where: any = {}, options: any = {}) => {
  await connectDB()
  
  let query = VerificationLog.find(where)
  
  if (options.orderBy) {
    const [field, direction] = Object.entries(options.orderBy)[0]
    const sort: any = {}
    sort[field] = direction === 'asc' ? 1 : -1
    query = query.sort(sort)
  }
  
  if (options.skip) {
    query = query.skip(options.skip)
  }
  
  if (options.take) {
    query = query.limit(options.take)
  }
  
  return query.lean().exec()
}

const count = async (where: any = {}) => {
  await connectDB()
  return VerificationLog.countDocuments(where)
}

export {
  VerificationLog,
  create,
  findMany,
  count
} 