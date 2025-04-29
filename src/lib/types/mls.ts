import type { Document } from 'mongoose'

export interface MLSTransaction {
  ListingKey: string
  ListPrice: number
  ListAgentKey: string
  StandardStatus: string
  ModificationTimestamp: string
  ListDate: string
  StreetNumberNumeric: string
  StreetName: string
  City: string
  StateOrProvince: string
  PostalCode: string
  Bathrooms?: number
  Bedrooms?: number
  LivingArea?: number
  YearBuilt?: number
  PropertyType?: string
  PropertySubType?: string
  PendingTimestamp?: string
  CloseDate?: string
  TaxAnnualAmount?: number
}

export interface MLSAgent {
  MemberKey: string
  MemberKeyNumeric: number
  MemberMlsId: string
  MemberFirstName: string
  MemberLastName: string
  MemberFullName: string
  MemberEmail: string
  PreferredPhone?: string
  OfficeName: string
  MemberStateLicense?: string
  OfficeMlsId?: string
  OfficeKeyNumeric?: number
  ModificationTimestamp: string
}

export interface MLSAgentDocument extends Document {
  memberKey: string
  memberKeyNumeric: number
  memberMlsId: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  officeName: string
  stateLicense?: string
  officeMlsId?: string
  officeKeyNumeric?: number
  lastUpdated: Date
  _id: string
  __v: number
}

export interface MLSListingDocument extends Document {
  listingKey: string
  listPrice: number
  listAgentKey: string
  status: string
  modificationTimestamp: Date
  listDate: Date
  streetNumber: string
  streetName: string
  city: string
  state: string
  zipCode: string
  bathrooms?: number
  bedrooms?: number
  livingArea?: number
  yearBuilt?: number
  propertyType?: string
  propertySubType?: string
  pendingTimestamp?: Date
  closeDate?: Date
  taxAnnualAmount?: number
  lastUpdated: Date
  _id: string
  __v: number
} 