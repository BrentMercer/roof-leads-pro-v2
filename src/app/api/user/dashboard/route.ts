import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';
import SubscriptionHistory from '@/models/SubscriptionHistory';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email })
      .select('name email phone assignedZipCodes subscriptionStatus leadConnectorWebhookUrl');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get recent subscription history
    const recentActivity = await SubscriptionHistory.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('action createdAt planDetails zipCodeChanges');

    // Format recent activity
    const formattedActivity = recentActivity.map(activity => ({
      action: activity.action,
      date: activity.createdAt.toISOString(),
      details: {
        ...(activity.planDetails && {
          name: activity.planDetails.name,
          price: activity.planDetails.price,
          billingCycle: activity.planDetails.billingCycle
        }),
        ...(activity.zipCodeChanges && {
          zipCodeCount: activity.zipCodeChanges.added?.length || activity.zipCodeChanges.removed?.length
        })
      }
    }));

    // Get metrics
    const metrics = {
      activeZipCodes: user.assignedZipCodes?.length || 0,
      newLeads: 0, // TODO: Implement lead counting
      subscriptionStatus: user.subscriptionStatus || 'INACTIVE',
      webhookStatus: user.leadConnectorWebhookUrl ? 'Configured' : 'Not Configured'
    };

    return NextResponse.json({
      metrics,
      recentActivity: formattedActivity,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 