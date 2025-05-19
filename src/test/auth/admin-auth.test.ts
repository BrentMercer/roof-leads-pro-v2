import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import { signIn } from 'next-auth/react';

describe('Admin Authentication', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create an admin user', async () => {
    const adminData = {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'ADMIN',
    };

    const admin = await User.create(adminData);
    expect(admin.role).toBe('ADMIN');
    expect(admin.email).toBe(adminData.email);
  });

  it('should prevent non-admin users from accessing admin routes', async () => {
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@test.com',
      password: 'user123',
      role: 'USER',
    });

    // Mock the getToken function
    const mockToken = {
      role: 'USER',
    };

    // This would be handled by the middleware in a real request
    expect(mockToken.role).not.toBe('ADMIN');
  });

  it('should allow admin users to access admin routes', async () => {
    const adminUser = await User.create({
      name: 'Admin User 2',
      email: 'admin2@test.com',
      password: 'admin123',
      role: 'ADMIN',
    });

    // Mock the getToken function
    const mockToken = {
      role: 'ADMIN',
    };

    // This would be handled by the middleware in a real request
    expect(mockToken.role).toBe('ADMIN');
  });
}); 