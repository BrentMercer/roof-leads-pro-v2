import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Settings } from '@/models/Settings';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    const settings = await Settings.findOne({});
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    await connectToDatabase();

    const settings = await Settings.findOneAndUpdate(
      {},
      {
        defaultLeadPrice: parseFloat(data.defaultLeadPrice),
        maxZipCodesPerUser: parseInt(data.maxZipCodesPerUser),
        enableAutoAssignment: data.enableAutoAssignment,
        enableEmailNotifications: data.enableEmailNotifications,
        webhookUrl: data.webhookUrl,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 