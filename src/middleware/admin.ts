import { getServerSession } from 'next-auth'
import { User } from '@/lib/models/user'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole, User as UserType, AssignedZipCode } from '@/types/user'

// Helper function to check if user has access to a zip code
async function hasZipCodeAccess(userId: string, zipCode: string) {
  const user = await User.findById(userId) as UserType | null

  if (!user) return false

  // Super admins and sub-admins have access to all zip codes
  if (user.role === 'SUPER_ADMIN' || user.role === 'SUB_ADMIN') {
    return true
  }

  // Check if user has active access to this zip code
  return user.assignedZipCodes?.some(
    (assignment: AssignedZipCode) => assignment.zipCode === zipCode && assignment.active
  ) || false
}

// Middleware to check if user is an admin (super or sub)
export async function adminMiddleware(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const user = await User.findOne({ email: session.user.email }, { role: true }) as Pick<UserType, 'role'> | null

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'SUB_ADMIN')) {
    return NextResponse.json(
      { error: 'Not authorized' },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

// Middleware to check if user is a super admin
export async function superAdminMiddleware(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const user = await User.findOne({ email: session.user.email }, { role: true }) as Pick<UserType, 'role'> | null

  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Not authorized' },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

// Middleware to check zip code access
export async function zipCodeMiddleware(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  // Extract zip code from request (you'll need to implement this based on your routes)
  const zipCode = request.nextUrl.searchParams.get('zipCode')
  
  if (!zipCode) {
    return NextResponse.json(
      { error: 'Zip code is required' },
      { status: 400 }
    )
  }

  const hasAccess = await hasZipCodeAccess(session.user.id, zipCode)

  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Not authorized to access this zip code' },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

export { hasZipCodeAccess } 