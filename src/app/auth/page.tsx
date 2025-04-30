'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import type { ReCAPTCHAProps } from 'react-google-recaptcha';

// Dynamically import ReCAPTCHA with no SSR
const ReCAPTCHA = dynamic<ReCAPTCHAProps>(() => import('react-google-recaptcha'), {
  ssr: false,
});

// Add global type declarations
declare global {
  interface Window {
    onRecaptchaSuccess: (token: string) => void;
    onRecaptchaExpired: () => void;
    onRecaptchaError: () => void;
  }
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  phone: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Handle email verification
    const verifyToken = searchParams?.get('verify');
    if (verifyToken) {
      verifyEmail(verifyToken);
    }

    // Initialize reCAPTCHA callback functions
    window.onRecaptchaSuccess = (token: string) => {
      console.log('reCAPTCHA success callback:', token);
      setRecaptchaToken(token);
    };
    window.onRecaptchaExpired = () => {
      console.log('reCAPTCHA expired callback');
      setRecaptchaToken(null);
    };
    window.onRecaptchaError = () => {
      console.log('reCAPTCHA error callback');
      setRecaptchaToken(null);
    };

    // Log reCAPTCHA initialization
    console.log('reCAPTCHA site key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
  }, [searchParams, isMounted]);

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setSuccess('Email verified successfully! You can now sign in.');
      setActiveTab('login');
    } catch (error: any) {
      setError(error.message || 'An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    console.log('Starting registration process...');
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!recaptchaToken) {
        throw new Error('Please complete the reCAPTCHA verification');
      }

      console.log('Sending registration request...');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      });

      const result = await response.json();
      console.log('Registration response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Reset reCAPTCHA
      setRecaptchaToken(null);

      // Show success message and switch to login tab
      setSuccess('Registration successful! Please check your email to verify your account.');
      setActiveTab('login');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message);
      // Reset reCAPTCHA on error
      setRecaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    setRecaptchaToken(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'login'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('login')}
              >
                Sign in
              </button>
              <button
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'register'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('register')}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-md bg-red-50 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 rounded-md bg-green-50 text-green-700">
                {success}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form className="mt-6 space-y-6" onSubmit={handleLoginSubmit(handleLogin)}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      type="email"
                      {...registerLogin('email')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {loginErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{loginErrors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      {...registerLogin('password')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {loginErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && isMounted && (
              <form className="mt-6 space-y-6" onSubmit={handleRegisterSubmit(handleRegister)}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      type="text"
                      {...registerRegister('name')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {registerErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{registerErrors.name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      type="email"
                      {...registerRegister('email')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {registerErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{registerErrors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      {...registerRegister('password')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {registerErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{registerErrors.password.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      type="tel"
                      {...registerRegister('phone')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {registerErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{registerErrors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={(token) => {
                      console.log('reCAPTCHA token received:', token);
                      setRecaptchaToken(token);
                    }}
                    onExpired={() => {
                      console.log('reCAPTCHA expired');
                      setRecaptchaToken(null);
                    }}
                    onErrored={() => {
                      console.log('reCAPTCHA error');
                      setRecaptchaToken(null);
                    }}
                    size="normal"
                    theme="light"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !recaptchaToken}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 