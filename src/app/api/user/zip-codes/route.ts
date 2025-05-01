import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';
import SubscriptionHistory from '@/models/SubscriptionHistory';
import { connectToDatabase } from '@/lib/mongodb';

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
      .select('assignedZipCodes subscriptionStatus');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      zipCodes: user.assignedZipCodes || [],
      subscriptionStatus: user.subscriptionStatus
    });
  } catch (error) {
    console.error('Zip codes fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { zipCodes, action } = await request.json();

    if (!Array.isArray(zipCodes) || !['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
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

    // Update zip codes based on action
    if (action === 'add') {
      const newZipCodes = Array.from(new Set([...(user.assignedZipCodes || []), ...zipCodes]));
      await user.updateZipCodes(newZipCodes, 'ZIP_CODES_ADDED');
    } else {
      const remainingZipCodes = (user.assignedZipCodes || []).filter(
        (zip: string) => !zipCodes.includes(zip)
      );
      await user.updateZipCodes(remainingZipCodes, 'ZIP_CODES_REMOVED');
    }

    // Create subscription history entry
    const history = new SubscriptionHistory({
      userId: user._id,
      action: action === 'add' ? 'ZIP_CODES_ADDED' : 'ZIP_CODES_REMOVED',
      zipCodeChanges: {
        [action === 'add' ? 'added' : 'removed']: zipCodes
      }
    });
    await history.save();

    return NextResponse.json({
      message: `Zip codes ${action === 'add' ? 'added' : 'removed'} successfully`,
      zipCodes: user.assignedZipCodes
    });
  } catch (error) {
    console.error('Zip codes update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 