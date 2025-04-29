export interface SyncLog {
  type: 'MLS' | 'ZIP_CODES'
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  startTime: Date
  endTime?: Date
  error?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
} 