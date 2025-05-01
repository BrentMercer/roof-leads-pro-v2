import { AuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getMongoDBAdapter } from './mongodb-adapter';
import { connectToDatabase } from './mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const authOptions: AuthOptions = {
  adapter: getMongoDBAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Update last login
        user.last_login = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          rememberMe: credentials.rememberMe === 'true'
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rememberMe = user.rememberMe;
        token.lastActivity = Date.now();
        
        // Generate device ID for new sessions
        if (trigger === 'signIn') {
          token.deviceId = uuidv4();
        }
      }
      
      // Update last activity on each request
      if (token) {
        token.lastActivity = Date.now();
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.deviceId = token.deviceId;
        session.lastActivity = token.lastActivity;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is a relative url, prefix it with the base url
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl + '/dashboard';
    },
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 