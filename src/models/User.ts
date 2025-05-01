import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import SubscriptionHistory, { SubscriptionAction, SubscriptionStatus } from './SubscriptionHistory';

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
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
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