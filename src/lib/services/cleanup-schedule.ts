import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'
import { runCleanup } from './cleanup'

// Define cleanup schedule schema
const cleanupScheduleSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  time: { type: String, required: true }, // HH:mm format
  dayOfWeek: { type: Number, min: 0, max: 6 }, // 0-6 for weekly
  dayOfMonth: { type: Number, min: 1, max: 31 }, // 1-31 for monthly
  lastRun: Date,
  nextRun: Date
}, { timestamps: true })

const CleanupSchedule = mongoose.models.CleanupSchedule || mongoose.model('CleanupSchedule', cleanupScheduleSchema)

interface CleanupSchedule {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string // HH:mm format
  dayOfWeek?: number // 0-6 for weekly
  dayOfMonth?: number // 1-31 for monthly
  lastRun?: string
  nextRun?: string
}

export async function getCleanupSchedule(): Promise<CleanupSchedule | null> {
  await connectDB()
  const schedule = await CleanupSchedule.findOne().sort({ createdAt: -1 })
  return schedule ? {
    enabled: schedule.enabled,
    frequency: schedule.frequency,
    time: schedule.time,
    dayOfWeek: schedule.dayOfWeek,
    dayOfMonth: schedule.dayOfMonth,
    lastRun: schedule.lastRun?.toISOString(),
    nextRun: schedule.nextRun?.toISOString()
  } : null
}

export async function setCleanupSchedule(schedule: CleanupSchedule) {
  await connectDB()
  // Calculate next run time
  const nextRun = calculateNextRun(schedule)
  const updatedSchedule = { ...schedule, nextRun: new Date(nextRun) }
  
  await CleanupSchedule.findOneAndUpdate(
    {},
    updatedSchedule,
    { upsert: true, new: true }
  )
  
  return updatedSchedule
}

export async function recordCleanupRun() {
  await connectDB()
  const now = new Date()
  
  // Update last run time and calculate next run
  const schedule = await getCleanupSchedule()
  if (schedule) {
    schedule.lastRun = now.toISOString()
    await setCleanupSchedule(schedule)
  }
}

function calculateNextRun(schedule: CleanupSchedule): string {
  const now = new Date()
  const [hours, minutes] = schedule.time.split(':').map(Number)
  let next = new Date(now)
  next.setHours(hours, minutes, 0, 0)

  switch (schedule.frequency) {
    case 'daily':
      if (next <= now) next.setDate(next.getDate() + 1)
      break
    case 'weekly':
      next.setDate(next.getDate() + ((7 + (schedule.dayOfWeek || 0) - next.getDay()) % 7))
      if (next <= now) next.setDate(next.getDate() + 7)
      break
    case 'monthly':
      next.setDate(schedule.dayOfMonth || 1)
      if (next <= now) next.setMonth(next.getMonth() + 1)
      break
  }

  return next.toISOString()
} 