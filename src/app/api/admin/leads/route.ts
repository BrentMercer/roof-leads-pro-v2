import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const limit = 10;
    const skip = (page - 1) * limit;

    await connectToDatabase();

    // Build query
    const query: any = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { mlsId: { $regex: search, $options: 'i' } },
        { 'propertyAddress.street': { $regex: search, $options: 'i' } },
        { 'propertyAddress.city': { $regex: search, $options: 'i' } },
      ];
    }

    // Get leads with pagination
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Lead.countDocuments(query);

    return NextResponse.json({
      leads,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 