import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/admin/leads/route';
import Lead from '@/models/Lead';
import User from '@/models/User';
import { getServerSession } from 'next-auth';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Admin Leads API', () => {
  let adminUser: any;
  let testLeads: any[];

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'ADMIN',
    });

    // Create test leads
    testLeads = await Lead.create([
      {
        mlsId: 'TEST001',
        propertyAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
        },
        status: 'NEW',
      },
      {
        mlsId: 'TEST002',
        propertyAddress: {
          street: '456 Test Ave',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
        },
        status: 'CONTACTED',
      },
    ]);

    // Mock admin session
    (getServerSession as any).mockResolvedValue({
      user: { role: 'ADMIN' },
    });
  });

  it('should return leads with pagination', async () => {
    const request = new Request('http://localhost:3000/api/admin/leads?page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.leads).toHaveLength(2);
    expect(data.pagination).toEqual({
      total: 2,
      pages: 1,
      current: 1,
    });
  });

  it('should filter leads by status', async () => {
    const request = new Request(
      'http://localhost:3000/api/admin/leads?page=1&status=NEW'
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.leads).toHaveLength(1);
    expect(data.leads[0].status).toBe('NEW');
  });

  it('should search leads by MLS ID', async () => {
    const request = new Request(
      'http://localhost:3000/api/admin/leads?page=1&search=TEST001'
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.leads).toHaveLength(1);
    expect(data.leads[0].mlsId).toBe('TEST001');
  });

  it('should return 401 for non-admin users', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: 'USER' },
    });

    const request = new Request('http://localhost:3000/api/admin/leads');
    const response = await GET(request);

    expect(response.status).toBe(401);
  });
}); 