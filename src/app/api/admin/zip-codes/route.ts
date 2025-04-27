import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { findMany, findFirst, update } from '@/lib/models/user'
import { superAdminMiddleware } from '@/middleware/admin'
import type { NextRequest } from 'next/server'
import { User } from '@/types/user'

// GET /api/admin/zip-codes
// List all zip code assignments
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get all users with their zip code assignments
    const users = await findMany({
      select: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        assignedZipCodes: 1
      }
    }) as User[]

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching zip code assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch zip code assignments' },
      { status: 500 }
    )
  }
}

// POST /api/admin/zip-codes
// Assign a zip code to a user
export async function POST(request: NextRequest) {
  try {
    // Check if user is super admin
    const middlewareResponse = await superAdminMiddleware(request)
    if (middlewareResponse.status !== 200) {
      return middlewareResponse
    }

    const { userId, zipCode } = await request.json()

    if (!userId || !zipCode) {
      return NextResponse.json(
        { error: 'User ID and zip code are required' },
        { status: 400 }
      )
    }

    // Check if zip code is already assigned to another user
    const existingAssignment = await findFirst({
      'assignedZipCodes': {
        $elemMatch: {
          zipCode,
          active: true
        }
      }
    }) as User | null

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Zip code is already assigned to another user' },
        { status: 400 }
      )
    }

    // Add zip code to user
    const updatedUser = await update({ id: userId }, {
      $push: {
        assignedZipCodes: {
          zipCode,
          purchaseDate: new Date(),
          active: true
        }
      }
    }) as User

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error assigning zip code:', error)
    return NextResponse.json(
      { error: 'Failed to assign zip code' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/zip-codes
// Remove a zip code assignment
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is super admin
    const middlewareResponse = await superAdminMiddleware(request)
    if (middlewareResponse.status !== 200) {
      return middlewareResponse
    }

    const { userId, zipCode } = await request.json()

    if (!userId || !zipCode) {
      return NextResponse.json(
        { error: 'User ID and zip code are required' },
        { status: 400 }
      )
    }

    // Remove zip code from user
    const updatedUser = await update({ id: userId }, {
      $pull: {
        assignedZipCodes: {
          zipCode
        }
      }
    }) as User

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error removing zip code:', error)
    return NextResponse.json(
      { error: 'Failed to remove zip code' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/zip-codes
// Deactivate a zip code assignment
export async function PATCH(request: NextRequest) {
  try {
    // Check if user is super admin
    const middlewareResponse = await superAdminMiddleware(request)
    if (middlewareResponse.status !== 200) {
      return middlewareResponse
    }

    const { userId, zipCode } = await request.json()

    if (!userId || !zipCode) {
      return NextResponse.json(
        { error: 'User ID and zip code are required' },
        { status: 400 }
      )
    }

    // Deactivate zip code for user
    const updatedUser = await update({ 
      id: userId,
      'assignedZipCodes.zipCode': zipCode
    }, {
      $set: {
        'assignedZipCodes.$.active': false
      }
    }) as User

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error deactivating zip code:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate zip code' },
      { status: 500 }
    )
  }
} 