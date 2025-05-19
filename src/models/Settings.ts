import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    defaultLeadPrice: {
      type: Number,
      required: true,
      default: 50,
    },
    maxZipCodesPerUser: {
      type: Number,
      required: true,
      default: 10,
    },
    enableAutoAssignment: {
      type: Boolean,
      required: true,
      default: true,
    },
    enableEmailNotifications: {
      type: Boolean,
      required: true,
      default: true,
    },
    webhookUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Settings =
  mongoose.models.Settings || mongoose.model('Settings', settingsSchema); 