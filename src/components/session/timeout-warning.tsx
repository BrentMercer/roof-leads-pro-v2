'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes before session expires
const CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

export function SessionTimeoutWarning() {
  const { data: session, update: updateSession } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const checkSessionExpiry = useCallback(() => {
    if (!session?.lastActivity) return;

    const sessionTimeout = 30 * 60 * 1000; // 30 minutes (match with middleware)
    const timeSinceLastActivity = Date.now() - session.lastActivity;
    const timeUntilExpiry = sessionTimeout - timeSinceLastActivity;

    if (timeUntilExpiry <= WARNING_THRESHOLD) {
      setShowWarning(true);
      setCountdown(Math.floor(timeUntilExpiry / 1000));
    }
  }, [session?.lastActivity]);

  useEffect(() => {
    const intervalId = setInterval(checkSessionExpiry, CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [checkSessionExpiry]);

  useEffect(() => {
    if (countdown > 0 && showWarning) {
      const countdownId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownId);
            signOut({ callbackUrl: '/login' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownId);
    }
  }, [countdown, showWarning]);

  const handleExtendSession = async () => {
    try {
      await updateSession();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
      signOut({ callbackUrl: '/login' });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in {formatTime(countdown)}. Would you like to extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => signOut({ callbackUrl: '/login' })}>
            Logout Now
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleExtendSession}>
            Extend Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 