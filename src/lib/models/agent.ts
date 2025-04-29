import mongoose from 'mongoose'

const agentSchema = new mongoose.Schema({
  memberKey: {
    type: String,
    required: true,
    unique: true
  },
  memberKeyNumeric: {
    type: Number,
    required: true
  },
  memberMlsId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  officeName: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  stateLicense: {
    type: String
  },
  officeMlsId: {
    type: String
  },
  officeKeyNumeric: {
    type: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Create indexes
agentSchema.index({ memberKey: 1 })
agentSchema.index({ memberMlsId: 1 })
agentSchema.index({ email: 1 })
agentSchema.index({ fullName: 1 })

export const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema) 