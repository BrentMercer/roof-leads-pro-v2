export interface Transaction {
  mlsId: string
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  propertyType: string
  listPrice: number
  listDate: Date
  closePrice?: number
  closeDate?: Date
  agentMlsId: string
  agentName: string
  officeMlsId: string
  officeName: string
  status: 'ACTIVE' | 'PENDING' | 'SOLD' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
} 