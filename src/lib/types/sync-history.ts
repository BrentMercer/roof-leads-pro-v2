import { Document } from 'mongoose'

export interface SyncHistoryDocument extends Document {
  startTime: Date
  endTime?: Date
  status: 'success' | 'failed' | 'in-progress'
  listingsProcessed?: number
  agentsProcessed?: number
  listingsUpserted?: number
  agentsUpserted?: number
  error?: string
  duration?: number
  _id: string
  __v: number
} 