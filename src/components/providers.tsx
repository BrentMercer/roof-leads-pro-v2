'use client';

import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { ThemeProvider } from './theme-provider';

export function Providers({ 
  children,
  session 
}: { 
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
} 