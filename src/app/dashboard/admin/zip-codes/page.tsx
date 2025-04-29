import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { Types } from 'mongoose'
import { Suspense } from 'react'
import { ZipCodePurchase } from './zip-code-purchase'
import { ZipCodeList } from './zip-code-list'
import { Skeleton } from '@/components/ui/skeleton'
import { findMany } from '@/lib/models/user'
import type { UserDocument } from '@/lib/types/user'

export const metadata: Metadata = {
  title: "Zip Code Management | Roof Leads Pro",
  description: "Manage zip code assignments and subscriptions",
}

interface ZipCodeAssignment {
  zipCode: string
  purchaseDate: Date
  active: boolean
  source: 'PURCHASE' | 'ADMIN_ASSIGN' | 'GIFT'
}

interface User {
  id: string
  name: string | null
  email: string
  role: 'USER' | 'SUPER_ADMIN' | 'SUB_ADMIN'
  assignedZipCodes: ZipCodeAssignment[]
}

async function getUsers(): Promise<User[]> {
  const users = await findMany({}) as UserDocument[]
  return users.map(user => ({
    id: user._id.toString(),
    name: user.name || null,
    email: user.email || '',
    role: user.role || 'USER',
    assignedZipCodes: (user.assignedZipCodes || []).map(assignment => ({
      zipCode: assignment.zipCode,
      purchaseDate: assignment.purchaseDate,
      active: assignment.active,
      source: 'PURCHASE' // Default source for existing assignments
    }))
  }))
}

async function getZipCodeAssignments() {
  const users = await getUsers()
  return users.flatMap(user => 
    user.assignedZipCodes.map(assignment => ({
      ...assignment,
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    }))
  )
}

export default async function ZipCodesPage() {
  const session = await getServerSession()
  const users = await getUsers()
  const assignments = await getZipCodeAssignments()

  if (!session?.user) {
    return <div>Please sign in to access this page</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Zip Code Management</h1>
      
      <div className="space-y-8">
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Purchase Zip Code</h2>
          <Suspense fallback={<Skeleton className="h-20" />}>
            <ZipCodePurchase user={{
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.name || null
            }} />
          </Suspense>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Assigned Zip Codes</h2>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <ZipCodeList users={users} />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 