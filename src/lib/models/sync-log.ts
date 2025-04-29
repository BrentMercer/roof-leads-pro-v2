import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'

interface SyncLogDocument extends mongoose.Document {
  type: 'Full' | 'Incremental'
  status: 'In Progress' | 'Success' | 'Failed'
  startTime: Date
  endTime?: Date
  recordsProcessed?: number
  error?: string
  createdAt: Date
  updatedAt: Date
}

const SyncLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Full', 'Incremental'],
    required: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Success', 'Failed'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  recordsProcessed: Number,
  error: String
}, {
  timestamps: true
})

// Add indexes
SyncLogSchema.index({ status: 1 })
SyncLogSchema.index({ startTime: -1 })

// Model
const SyncLog = mongoose.models.SyncLog || mongoose.model<SyncLogDocument>('SyncLog', SyncLogSchema)

// Helper functions
export const create = async (data: {
  type: 'Full' | 'Incremental'
  status: 'In Progress' | 'Success' | 'Failed'
  startTime: Date
}) => {
  await connectDB()
  const syncLog = new SyncLog(data)
  return syncLog.save()
}

export const update = async (id: string, data: {
  status?: 'In Progress' | 'Success' | 'Failed'
  recordsProcessed?: number
  error?: string
  endTime?: Date
}) => {
  await connectDB()
  return SyncLog.findByIdAndUpdate(
    id,
    {
      ...data,
      endTime: data.endTime || new Date()
    },
    { new: true }
  ).lean().exec()
}

export const findFirst = async (query: Record<string, any>) => {
  await connectDB()
  return SyncLog.findOne(query).sort({ endTime: -1 }).lean().exec()
}

export { SyncLog } 