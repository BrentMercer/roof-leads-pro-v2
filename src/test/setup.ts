import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Connect to the test database before all tests
beforeAll(async () => {
  await connectToDatabase();
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
}); 