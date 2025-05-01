import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      rememberMe?: boolean;
    } & DefaultSession['user'];
    deviceId?: string;
    lastActivity?: number;
  }

  interface User {
    id: string;
    role: string;
    rememberMe?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    rememberMe?: boolean;
    lastActivity?: number;
    deviceId?: string;
    sessionTimeout?: number;
  }
} 