import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Settings } from '@/models/Settings';

describe('Settings Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || '');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create settings with default values', async () => {
    const settings = await Settings.create({});
    expect(settings.defaultLeadPrice).toBe(50);
    expect(settings.maxZipCodesPerUser).toBe(10);
    expect(settings.enableAutoAssignment).toBe(true);
    expect(settings.enableEmailNotifications).toBe(true);
    expect(settings.webhookUrl).toBeUndefined();
  });

  it('should validate required fields', async () => {
    try {
      await Settings.create({
        defaultLeadPrice: null,
        maxZipCodesPerUser: null,
        enableAutoAssignment: null,
        enableEmailNotifications: null,
      });
      expect(true).toBe(false); // Should not reach this line
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should accept valid webhook URL', async () => {
    const settings = await Settings.create({
      webhookUrl: 'https://example.com/webhook',
    });
    expect(settings.webhookUrl).toBe('https://example.com/webhook');
  });

  it('should update settings correctly', async () => {
    const settings = await Settings.findOneAndUpdate(
      {},
      {
        defaultLeadPrice: 75,
        maxZipCodesPerUser: 15,
        enableAutoAssignment: false,
        enableEmailNotifications: false,
        webhookUrl: 'https://new-webhook.com',
      },
      { new: true, upsert: true }
    );

    expect(settings.defaultLeadPrice).toBe(75);
    expect(settings.maxZipCodesPerUser).toBe(15);
    expect(settings.enableAutoAssignment).toBe(false);
    expect(settings.enableEmailNotifications).toBe(false);
    expect(settings.webhookUrl).toBe('https://new-webhook.com');
  });
}); 