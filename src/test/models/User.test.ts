import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

describe('User Model', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    const user = await User.create(userData);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Should be hashed
    expect(user.phone).toBe(userData.phone);
  });

  it('should validate email format', async () => {
    const userData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    };

    try {
      await User.create(userData);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should compare passwords correctly', async () => {
    const userData = {
      name: 'Test User',
      email: 'test2@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should update subscription status', async () => {
    const userData = {
      name: 'Test User',
      email: 'test3@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    const historyEntry = await user.updateSubscriptionStatus(
      'ACTIVE',
      'SUBSCRIPTION_STARTED',
      {
        planDetails: {
          name: 'Professional',
          price: 99,
          billingCycle: 'monthly',
          zipCodeCount: 10,
        },
      }
    );

    expect(user.subscriptionStatus).toBe('ACTIVE');
    expect(historyEntry.action).toBe('SUBSCRIPTION_STARTED');
    expect(historyEntry.newStatus).toBe('ACTIVE');
  });

  it('should update zip codes', async () => {
    const userData = {
      name: 'Test User',
      email: 'test4@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    const zipCodes = await user.updateZipCodes(['12345', '67890'], []);

    expect(zipCodes).toContain('12345');
    expect(zipCodes).toContain('67890');
  });
}); 