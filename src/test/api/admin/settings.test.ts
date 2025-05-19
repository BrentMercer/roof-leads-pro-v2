import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/admin/settings/route';
import { Settings } from '@/models/Settings';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Admin Settings API', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Settings.deleteMany({});
    vi.clearAllMocks();
  });

  it('should return 401 for unauthorized access', async () => {
    (getServerSession as any).mockResolvedValue(null);
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it('should return 401 for non-admin users', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: 'USER' },
    });
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it('should return default settings for admin users', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: 'ADMIN' },
    });
    const response = await GET();
    const data = await response.json();
    expect(data.defaultLeadPrice).toBe(50);
    expect(data.maxZipCodesPerUser).toBe(10);
    expect(data.enableAutoAssignment).toBe(true);
    expect(data.enableEmailNotifications).toBe(true);
  });

  it('should update settings for admin users', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: 'ADMIN' },
    });

    const request = new Request('http://localhost:3000/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        defaultLeadPrice: '75',
        maxZipCodesPerUser: '15',
        enableAutoAssignment: false,
        enableEmailNotifications: false,
        webhookUrl: 'https://example.com/webhook',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.defaultLeadPrice).toBe(75);
    expect(data.maxZipCodesPerUser).toBe(15);
    expect(data.enableAutoAssignment).toBe(false);
    expect(data.enableEmailNotifications).toBe(false);
    expect(data.webhookUrl).toBe('https://example.com/webhook');
  });

  it('should validate settings data', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: 'ADMIN' },
    });

    const request = new Request('http://localhost:3000/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        defaultLeadPrice: 'invalid',
        maxZipCodesPerUser: 'invalid',
        enableAutoAssignment: 'invalid',
        enableEmailNotifications: 'invalid',
        webhookUrl: 'invalid-url',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
}); 