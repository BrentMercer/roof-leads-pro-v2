// MongoDB client interface for consistent database access
import * as UserModel from '@/lib/models/user'
import * as VerificationLogModel from '@/lib/models/verification-log'
import * as SyncLogModel from '@/lib/models/sync-log'

// MongoDB client interface that provides consistent database operations
export const mongoClient = {
  user: {
    findOne: async (query: any) => {
      return UserModel.findUnique(query.where)
    },
    find: async (query: any) => {
      return UserModel.findMany(query)
    },
    findFirst: async (query: any) => {
      return UserModel.findFirst(query.where)
    },
    create: async (query: any) => {
      return UserModel.create(query.data)
    },
    updateOne: async (query: any) => {
      return UserModel.update(query.where, query.data)
    },
    deleteOne: async (query: any) => {
      return UserModel.deleteUser(query.where)
    }
  },
  
  verificationLog: {
    create: async (query: any) => {
      return VerificationLogModel.create(query.data)
    },
    find: async (query: any = {}) => {
      return VerificationLogModel.findMany(
        query.where,
        {
          orderBy: query.orderBy,
          skip: query.skip,
          take: query.take
        }
      )
    },
    countDocuments: async (query: any = {}) => {
      return VerificationLogModel.count(query.where)
    }
  },
  
  syncLog: {
    create: async (query: any) => {
      return SyncLogModel.create(query.data)
    },
    find: async (query: any = {}) => {
      return SyncLogModel.findFirst(query.where)
    },
    updateOne: async (query: any) => {
      return SyncLogModel.update(query.where.id, query.data)
    }
  }
} 