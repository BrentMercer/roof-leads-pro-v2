import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  organization: {
    name: String,
    type: {
      type: String,
      enum: ['INDIVIDUAL', 'BUSINESS', 'ENTERPRISE'],
      default: 'INDIVIDUAL',
    },
    taxId: String,
    website: String,
  },
  billing: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    contactName: String,
    contactEmail: String,
    contactPhone: String,
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: false,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'TERMINATED'],
    default: 'ACTIVE',
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Create indexes
accountSchema.index({ userId: 1 });
accountSchema.index({ 'organization.name': 1 });
accountSchema.index({ status: 1 });

const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);

export default Account; 