import mongoose from 'mongoose';

export type SubscriptionAction = 
  | 'SUBSCRIPTION_STARTED'
  | 'SUBSCRIPTION_RENEWED'
  | 'SUBSCRIPTION_CANCELLED'
  | 'SUBSCRIPTION_EXPIRED'
  | 'PLAN_CHANGED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'ZIP_CODES_ADDED'
  | 'ZIP_CODES_REMOVED';

export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'TRIAL' | 'CANCELLED' | 'EXPIRED';

const subscriptionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: [
      'SUBSCRIPTION_STARTED',
      'SUBSCRIPTION_RENEWED',
      'SUBSCRIPTION_CANCELLED',
      'SUBSCRIPTION_EXPIRED',
      'PLAN_CHANGED',
      'PAYMENT_SUCCESS',
      'PAYMENT_FAILED',
      'ZIP_CODES_ADDED',
      'ZIP_CODES_REMOVED'
    ],
    required: true,
  },
  previousStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'TRIAL', 'CANCELLED', 'EXPIRED'],
  },
  newStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'TRIAL', 'CANCELLED', 'EXPIRED'],
  },
  planDetails: {
    name: String,
    price: Number,
    billingCycle: String, // e.g., 'monthly', 'annual'
    zipCodeCount: Number,
  },
  paymentDetails: {
    amount: Number,
    currency: String,
    transactionId: String,
    status: String,
  },
  zipCodeChanges: {
    added: [String],
    removed: [String],
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
subscriptionHistorySchema.index({ userId: 1, createdAt: -1 });
subscriptionHistorySchema.index({ action: 1, createdAt: -1 });

// Create and export the model
const SubscriptionHistory = mongoose.models.SubscriptionHistory || 
  mongoose.model('SubscriptionHistory', subscriptionHistorySchema);

export default SubscriptionHistory; 