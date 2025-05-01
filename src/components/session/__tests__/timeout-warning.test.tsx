import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionTimeoutWarning } from '../timeout-warning';
import { useSession, signOut } from 'next-auth/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

describe('SessionTimeoutWarning', () => {
  const mockSession = {
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
      lastActivity: Date.now(),
    },
    update: vi.fn().mockResolvedValue(true),
    status: 'authenticated',
  };

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    (useSession as any).mockReturnValue(mockSession);
    (signOut as any).mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should not show warning when session is active', () => {
    render(<SessionTimeoutWarning />);
    expect(screen.queryByText(/Session Expiring Soon/i)).not.toBeInTheDocument();
  });

  it('should show warning when session is about to expire', () => {
    // Set lastActivity to 26 minutes ago (4 minutes before expiry)
    const mockExpiredSession = {
      ...mockSession,
      data: {
        ...mockSession.data,
        lastActivity: Date.now() - 26 * 60 * 1000,
      },
    };
    (useSession as any).mockReturnValue(mockExpiredSession);

    render(<SessionTimeoutWarning />);
    expect(screen.getByText(/Session Expiring Soon/i)).toBeInTheDocument();
  });

  it('should auto-logout when session has expired', () => {
    // Set lastActivity to 31 minutes ago (1 minute past expiry)
    const mockExpiredSession = {
      ...mockSession,
      data: {
        ...mockSession.data,
        lastActivity: Date.now() - 31 * 60 * 1000,
      },
    };
    (useSession as any).mockReturnValue(mockExpiredSession);

    render(<SessionTimeoutWarning />);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('should extend session when clicking extend button', async () => {
    const user = userEvent.setup({ delay: null });
    const mockNearExpirySession = {
      ...mockSession,
      data: {
        ...mockSession.data,
        lastActivity: Date.now() - 26 * 60 * 1000,
      },
    };
    (useSession as any).mockReturnValue(mockNearExpirySession);

    render(<SessionTimeoutWarning />);
    expect(screen.getByText(/Session Expiring Soon/i)).toBeInTheDocument();

    // Click extend session button
    const extendButton = screen.getByText(/Extend Session/i);
    await user.click(extendButton);

    expect(mockSession.update).toHaveBeenCalled();
    expect(screen.queryByText(/Session Expiring Soon/i)).not.toBeInTheDocument();
  });

  it('should logout when clicking logout button', async () => {
    const user = userEvent.setup({ delay: null });
    const mockNearExpirySession = {
      ...mockSession,
      data: {
        ...mockSession.data,
        lastActivity: Date.now() - 26 * 60 * 1000,
      },
    };
    (useSession as any).mockReturnValue(mockNearExpirySession);

    render(<SessionTimeoutWarning />);
    expect(screen.getByText(/Session Expiring Soon/i)).toBeInTheDocument();

    // Click logout button
    const logoutButton = screen.getByText(/Logout Now/i);
    await user.click(logoutButton);

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
}); 