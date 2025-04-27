import mongoose from 'mongoose'

const zipCodeMetricsSchema = new mongoose.Schema({
  zipCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  monthlyTransactions: {
    type: Number,
    required: true,
    default: 0
  },
  averagePrice: {
    type: Number,
    required: true,
    default: 0
  },
  recentPendings: {
    type: Number,
    required: true,
    default: 0
  },
  totalPendings: {
    type: Number,
    required: true,
    default: 0
  },
  lastUpdate: {
    type: Date,
    required: true,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})

// Create model if it doesn't exist (prevents multiple model creation error)
export const ZipCodeMetrics = mongoose.models.ZipCodeMetrics || mongoose.model('ZipCodeMetrics', zipCodeMetricsSchema) 