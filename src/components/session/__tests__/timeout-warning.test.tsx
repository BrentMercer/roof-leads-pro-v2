import { render, screen, act, waitFor } from '@testing-library/react';
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
    vi.useFakeTimers();
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

  it('should show warning when session is about to expire', async () => {
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

    // Fast-forward 30 seconds for the check interval
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Session Expiring Soon/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('should auto-logout when countdown reaches zero', async () => {
    // Set lastActivity to 29.5 minutes ago (30 seconds before expiry)
    const mockNearExpirySession = {
      ...mockSession,
      data: {
        ...mockSession.data,
        lastActivity: Date.now() - 29.5 * 60 * 1000,
      },
    };
    (useSession as any).mockReturnValue(mockNearExpirySession);

    render(<SessionTimeoutWarning />);

    // Fast-forward 30 seconds for the check interval
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
    }, { timeout: 10000 });
  });

  it('should extend session when clicking extend button', async () => {
    const mockNearExpirySession = {
      ...mockSession,
      data: {
        ...mockSession.data,
        lastActivity: Date.now() - 26 * 60 * 1000,
      },
    };
    (useSession as any).mockReturnValue(mockNearExpirySession);

    render(<SessionTimeoutWarning />);

    // Fast-forward 30 seconds for the check interval
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Session Expiring Soon/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Click extend session button
    const extendButton = screen.getByText(/Extend Session/i);
    await act(async () => {
      await userEvent.click(extendButton);
    });

    expect(mockSession.update).toHaveBeenCalled();
  });

  it('should logout when clicking logout button', async () => {
    const mockNearExpirySession = {
      ...mockSession,
      data: {
        ...mockSession.data,
        lastActivity: Date.now() - 26 * 60 * 1000,
      },
    };
    (useSession as any).mockReturnValue(mockNearExpirySession);

    render(<SessionTimeoutWarning />);

    // Fast-forward 30 seconds for the check interval
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Session Expiring Soon/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Click logout button
    const logoutButton = screen.getByText(/Logout Now/i);
    await act(async () => {
      await userEvent.click(logoutButton);
    });

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
}, { timeout: 20000 }); 