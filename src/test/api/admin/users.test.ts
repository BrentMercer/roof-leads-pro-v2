import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { GET } from '@/app/api/admin/users/route';
import { User } from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Admin Users API', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    vi.clearAllMocks();
  });

  it('should return 401 for unauthorized access', async () => {
    (getServerSession as any).mockResolvedValue(null);
    const request = new Request('http://localhost:3000/api/admin/users');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('should return 401 for non-admin users', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: 'USER' },
    });
    const request = new Request('http://localhost:3000/api/admin/users');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('should return paginated users for admin users', async () => {
    // Create test users
    await User.create([
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123',
        role: 'USER',
        subscriptionStatus: 'active',
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123',
        role: 'USER',
        subscriptionStatus: 'inactive',
      },
    ]);

    (getServerSession as any).mockResolvedValue({
      user: { role: 'ADMIN' },
    });

    const request = new Request('http://localhost:3000/api/admin/users?page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(data.users).toHaveLength(2);
    expect(data.totalPages).toBe(1);
    expect(data.currentPage).toBe(1);
    expect(data.users[0].password).toBeUndefined();
  });

  it('should filter users by status', async () => {
    // Create test users
    await User.create([
      {
        name: 'Active User',
        email: 'active@example.com',
        password: 'password123',
        role: 'USER',
        subscriptionStatus: 'active',
      },
      {
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: 'password123',
        role: 'USER',
        subscriptionStatus: 'inactive',
      },
    ]);

    (getServerSession as any).mockResolvedValue({
      user: { role: 'ADMIN' },
    });

    const request = new Request(
      'http://localhost:3000/api/admin/users?page=1&status=active'
    );
    const response = await GET(request);
    const data = await response.json();

    expect(data.users).toHaveLength(1);
    expect(data.users[0].subscriptionStatus).toBe('active');
  });

  it('should search users by name or email', async () => {
    // Create test users
    await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'USER',
        subscriptionStatus: 'active',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'USER',
        subscriptionStatus: 'active',
      },
    ]);

    (getServerSession as any).mockResolvedValue({
      user: { role: 'ADMIN' },
    });

    const request = new Request(
      'http://localhost:3000/api/admin/users?page=1&search=john'
    );
    const response = await GET(request);
    const data = await response.json();

    expect(data.users).toHaveLength(1);
    expect(data.users[0].name).toBe('John Doe');
  });
}); 