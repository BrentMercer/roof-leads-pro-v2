import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import Lead from '@/models/Lead';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

describe('Lead Model', () => {
  let testUser: any;

  beforeAll(async () => {
    await connectToDatabase();
    // Create a test user for lead assignment
    testUser = await User.create({
      name: 'Test Agent',
      email: 'agent@test.com',
      password: 'password123',
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new lead', async () => {
    const leadData = {
      mlsId: 'TEST123',
      propertyAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'US',
      },
      propertyDetails: {
        type: 'Single Family',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2000,
        yearBuilt: 2000,
        roofAge: 15,
        roofType: 'Asphalt',
        lastSaleDate: new Date(),
        lastSalePrice: 300000,
      },
      ownerInfo: {
        name: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        mailingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
        },
      },
    };

    const lead = await Lead.create(leadData);
    expect(lead.mlsId).toBe(leadData.mlsId);
    expect(lead.status).toBe('NEW');
    expect(lead.propertyAddress.zipCode).toBe(leadData.propertyAddress.zipCode);
  });

  it('should update lead status', async () => {
    const lead = await Lead.create({
      mlsId: 'TEST456',
      propertyAddress: {
        street: '456 Test Ave',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
    });

    lead.status = 'CONTACTED';
    await lead.save();

    const updatedLead = await Lead.findById(lead._id);
    expect(updatedLead?.status).toBe('CONTACTED');
  });

  it('should assign lead to user', async () => {
    const lead = await Lead.create({
      mlsId: 'TEST789',
      propertyAddress: {
        street: '789 Test Blvd',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
    });

    lead.assignedTo = testUser._id;
    await lead.save();

    const updatedLead = await Lead.findById(lead._id).populate('assignedTo');
    expect(updatedLead?.assignedTo._id.toString()).toBe(testUser._id.toString());
  });

  it('should add notes to lead', async () => {
    const lead = await Lead.create({
      mlsId: 'TEST101',
      propertyAddress: {
        street: '101 Test Rd',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
    });

    lead.notes.push({
      content: 'Test note',
      createdBy: testUser._id,
    });
    await lead.save();

    const updatedLead = await Lead.findById(lead._id).populate('notes.createdBy');
    expect(updatedLead?.notes[0].content).toBe('Test note');
    expect(updatedLead?.notes[0].createdBy._id.toString()).toBe(testUser._id.toString());
  });
}); 