import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import SubscriptionHistory, { SubscriptionAction, SubscriptionStatus } from './SubscriptionHistory';
import Account from './Account';
import Transaction from './Transaction';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  phone: {
    type: String,
    trim: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  subscriptionStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'TRIAL', 'CANCELLED', 'EXPIRED'],
    default: 'INACTIVE',
  },
  subscriptionHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionHistory',
  }],
  assignedZipCodes: [{
    type: String,
    trim: true,
  }],
  leadConnectorWebhookUrl: {
    type: String,
    trim: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // Session Management Fields
  activeSessions: [{
    deviceId: String,
    deviceInfo: {
      browser: String,
      os: String,
      ip: String,
      lastActivity: Date
    },
    createdAt: Date,
    expiresAt: Date
  }],
  rememberMe: { type: Boolean, default: false },
  sessionTimeout: { type: Number, default: 30 * 60 * 1000 } // 30 minutes default
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Check if password is already hashed (starts with $2a$)
    if (this.password.startsWith('$2a$')) {
      return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to create or update account
userSchema.methods.createOrUpdateAccount = async function(accountData: {
  organization?: {
    name?: string;
    type?: 'INDIVIDUAL' | 'BUSINESS' | 'ENTERPRISE';
    taxId?: string;
    website?: string;
  };
  billing?: {
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    timezone?: string;
    language?: string;
  };
}) {
  if (this.account) {
    // Update existing account
    const account = await Account.findByIdAndUpdate(
      this.account,
      { $set: accountData },
      { new: true }
    );
    return account;
  } else {
    // Create new account
    const account = await Account.create({
      userId: this._id,
      ...accountData,
    });
    this.account = account._id;
    await this.save();
    return account;
  }
};

// Method to create transaction
userSchema.methods.createTransaction = async function(transactionData: {
  type: 'SUBSCRIPTION' | 'ZIP_CODE_PURCHASE' | 'REFUND' | 'ADJUSTMENT';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  amount: number;
  currency?: string;
  paymentMethod: {
    type: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  billingCycle: 'MONTHLY' | 'ANNUAL';
  description?: string;
}) {
  const transaction = await Transaction.create({
    userId: this._id,
    accountId: this.account,
    ...transactionData,
  });
  
  this.transactions.push(transaction._id);
  await this.save();
  
  return transaction;
};

// Method to update subscription status and create history entry
userSchema.methods.updateSubscriptionStatus = async function(
  newStatus: SubscriptionStatus,
  action: SubscriptionAction,
  details: {
    planDetails?: {
      name: string;
      price: number;
      billingCycle: string;
      zipCodeCount: number;
    };
    paymentDetails?: {
      amount: number;
      currency: string;
      transactionId: string;
      status: string;
    };
    zipCodeChanges?: {
      added: string[];
      removed: string[];
    };
    metadata?: Record<string, any>;
  } = {}
) {
  const previousStatus = this.subscriptionStatus;
  
  // Create history entry
  const historyEntry = await SubscriptionHistory.create({
    userId: this._id,
    action,
    previousStatus,
    newStatus,
    ...details,
  });

  // Create transaction if payment details are provided
  if (details.paymentDetails) {
    await this.createTransaction({
      type: 'SUBSCRIPTION',
      status: details.paymentDetails.status === 'success' ? 'COMPLETED' : 'FAILED',
      amount: details.paymentDetails.amount,
      currency: details.paymentDetails.currency,
      paymentMethod: {
        type: 'CREDIT_CARD', // Default to credit card, can be updated based on actual payment method
      },
      billingCycle: details.planDetails?.billingCycle === 'annual' ? 'ANNUAL' : 'MONTHLY',
      description: `${action} - ${details.planDetails?.name || 'Subscription'}`,
    });
  }

  // Update user's subscription status
  this.subscriptionStatus = newStatus;
  this.subscriptionHistory.push(historyEntry._id);
  await this.save();

  return historyEntry;
};

// Method to update assigned zip codes
userSchema.methods.updateZipCodes = async function(
  added: string[] = [],
  removed: string[] = []
) {
  // Remove specified zip codes
  this.assignedZipCodes = this.assignedZipCodes.filter(
    (zip: string) => !removed.includes(zip)
  );
  
  // Add new zip codes
  const newZipCodes = added.filter(
    (zip: string) => !this.assignedZipCodes.includes(zip)
  );
  this.assignedZipCodes.push(...newZipCodes);

  // Create history entry if there were changes
  if (added.length > 0 || removed.length > 0) {
    await this.updateSubscriptionStatus(
      this.subscriptionStatus,
      'ZIP_CODES_ADDED',
      {
        zipCodeChanges: { added, removed },
      }
    );
  }

  await this.save();
  return this.assignedZipCodes;
};

// Create and export the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 