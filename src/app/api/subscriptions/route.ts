import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStripeClient } from '@/lib/stripe';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { planId, paymentIntentId } = await req.json();
    
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();
    const subscription = await stripe.createSubscription(
      user._id.toString(), // Using user ID as customer ID for mock
      planId
    );

    // Update user's subscription status
    await user.updateSubscriptionStatus(
      'ACTIVE',
      'SUBSCRIPTION_STARTED',
      {
        planDetails: {
          name: plan.name,
          price: plan.price,
          billingCycle: plan.interval,
          zipCodeCount: plan.zipCodeLimit
        },
        paymentDetails: {
          amount: plan.price,
          currency: 'usd',
          transactionId: paymentIntentId,
          status: 'succeeded'
        }
      }
    );

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const stripe = getStripeClient();
    const subscription = await stripe.cancelSubscription('mock_subscription_id');

    // Update user's subscription status
    await user.updateSubscriptionStatus(
      'CANCELLED',
      'SUBSCRIPTION_CANCELLED'
    );

    return NextResponse.json({
      status: subscription.status,
      canceledAt: subscription.canceledAt
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
} 