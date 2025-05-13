import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStripeClient } from '@/lib/stripe';
import { calculateZipCodePrice } from '@/lib/stripe';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { planId, zipCodeCount } = await req.json();
    
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const stripe = getStripeClient();
    const amount = calculateZipCodePrice(49, zipCodeCount, planId); // Base price of $49

    const paymentIntent = await stripe.createPaymentIntent(
      amount * 100, // Convert to cents
      'usd'
    );

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 