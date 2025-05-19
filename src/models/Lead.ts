import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  mlsId: {
    type: String,
    required: true,
    unique: true,
  },
  propertyAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  propertyDetails: {
    type: String,
    bedrooms: Number,
    bathrooms: Number,
    squareFeet: Number,
    yearBuilt: Number,
    roofAge: Number,
    roofType: String,
    lastSaleDate: Date,
    lastSalePrice: Number,
  },
  ownerInfo: {
    name: String,
    email: String,
    phone: String,
    mailingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'],
    default: 'NEW',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  history: [{
    action: {
      type: String,
      enum: ['CREATED', 'UPDATED', 'ASSIGNED', 'STATUS_CHANGED', 'NOTE_ADDED'],
    },
    details: mongoose.Schema.Types.Mixed,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Create indexes
leadSchema.index({ mlsId: 1 });
leadSchema.index({ 'propertyAddress.zipCode': 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export default Lead; 