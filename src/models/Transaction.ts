import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  type: {
    type: String,
    enum: ['SUBSCRIPTION', 'ZIP_CODE_PURCHASE', 'REFUND', 'ADJUSTMENT'],
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL'],
      required: true,
    },
    last4: String,
    brand: String,
    expiryMonth: Number,
    expiryYear: Number,
  },
  billingCycle: {
    type: String,
    enum: ['MONTHLY', 'ANNUAL'],
    required: true,
  },
  invoice: {
    number: String,
    url: String,
    dueDate: Date,
    paidAt: Date,
  },
  description: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  refundDetails: {
    amount: Number,
    reason: String,
    processedAt: Date,
  },
}, {
  timestamps: true,
});

// Create indexes for common queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ accountId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ 'invoice.number': 1 });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction; 