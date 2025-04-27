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
  MemberFirstName: string
  MemberLastName: string
  MemberEmail?: string
  PreferredPhone?: string
  OfficeName?: string
}

export interface MLSAgentDocument extends Document {
  memberKey: string
  memberFirstName: string
  memberLastName: string
  memberEmail?: string
  preferredPhone?: string
  officeName?: string
  _id: string
  __v: number
}

export interface MLSListingDocument extends Document {
  listingKey: string
  listPrice: number
  listAgentKey: string
  standardStatus: string
  modificationTimestamp: Date
  listDate: Date
  streetNumberNumeric: string
  streetName: string
  city: string
  stateOrProvince: string
  standardFields: {
    postalCode: string
  }
  _id: string
  __v: number
} 