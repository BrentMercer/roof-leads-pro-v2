import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import type { MLSTransaction } from '@/lib/types/mls'

interface TransactionDocument extends mongoose.Document {
  listingKey: string
  listPrice: number
  listAgentKey: string
  standardStatus: string
  modificationTimestamp: Date
  listDate: Date
  streetNumberNumeric: string
  streetName: string
  city: string
  stateOrProvince: string
  postalCode: string
  bathrooms?: number
  bedrooms?: number
  livingArea?: number
  yearBuilt?: number
  propertyType?: string
  propertySubType?: string
  pendingTimestamp?: Date
  closeDate?: Date
  taxAnnualAmount?: number
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new mongoose.Schema({
  listingKey: {
    type: String,
    required: true,
    unique: true
  },
  listPrice: {
    type: Number,
    required: true
  },
  listAgentKey: {
    type: String,
    required: true
  },
  standardStatus: {
    type: String,
    required: true
  },
  modificationTimestamp: {
    type: Date,
    required: true
  },
  listDate: {
    type: Date,
    required: true
  },
  streetNumberNumeric: String,
  streetName: String,
  city: String,
  stateOrProvince: String,
  postalCode: String,
  bathrooms: Number,
  bedrooms: Number,
  livingArea: Number,
  yearBuilt: Number,
  propertyType: String,
  propertySubType: String,
  pendingTimestamp: Date,
  closeDate: Date,
  taxAnnualAmount: Number
}, {
  timestamps: true
})

// Add indexes
TransactionSchema.index({ listingKey: 1 }, { unique: true })
TransactionSchema.index({ listAgentKey: 1 })
TransactionSchema.index({ postalCode: 1 })
TransactionSchema.index({ standardStatus: 1 })

// Model
const Transaction = mongoose.models.Transaction || mongoose.model<TransactionDocument>('Transaction', TransactionSchema)

// Helper functions
export const findUnique = async (where: { listingKey?: string }) => {
  await connectDB()
  if (where.listingKey) {
    return Transaction.findOne({ listingKey: where.listingKey }).lean().exec()
  }
  return null
}

export const findMany = async (query: {
  select?: Record<string, number>
  where?: Record<string, any>
  orderBy?: Record<string, 1 | -1>
  skip?: number
  take?: number
}) => {
  await connectDB()
  let mongoQuery = Transaction.find()

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

export const upsert = async (where: { listingKey: string }, data: Partial<MLSTransaction>) => {
  await connectDB()
  return Transaction.findOneAndUpdate(
    { listingKey: where.listingKey },
    {
      $set: {
        ...data,
        modificationTimestamp: new Date(data.ModificationTimestamp || Date.now()),
        listDate: new Date(data.ListDate || Date.now()),
        pendingTimestamp: data.PendingTimestamp ? new Date(data.PendingTimestamp) : undefined,
        closeDate: data.CloseDate ? new Date(data.CloseDate) : undefined
      }
    },
    { upsert: true, new: true }
  ).lean().exec()
}

export const count = async (where?: Record<string, any>) => {
  await connectDB()
  return Transaction.countDocuments(where || {}).exec()
}

export { Transaction } 