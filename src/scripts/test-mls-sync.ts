import { syncMLSData } from '../lib/sync/mls-sync.service'
import { Transaction } from '../lib/models/transaction'
import { Agent } from '../lib/models/agent'
import { connectDB } from '../lib/mongodb'

async function testSync() {
  try {
    console.log('\n1. Starting MLS Sync Test...')
    
    // Connect to MongoDB
    await connectDB()
    
    // Get current counts
    const beforeCounts = {
      transactions: await Transaction.countDocuments(),
      agents: await Agent.countDocuments()
    }
    console.log('Current database counts:', beforeCounts)

    // Run sync
    console.log('\n2. Running sync...')
    const result = await syncMLSData()
    console.log('Sync completed:', result)

    // Get new counts
    const afterCounts = {
      transactions: await Transaction.countDocuments(),
      agents: await Agent.countDocuments()
    }
    console.log('\n3. Updated database counts:', afterCounts)
    
    // Show sample data
    console.log('\n4. Sample Transaction:')
    const sampleTransaction = await Transaction.findOne()
      .populate('agent')
      .lean()
    console.log(JSON.stringify(sampleTransaction, null, 2))

    console.log('\nTest completed successfully!')
  } catch (error) {
    console.error('\nTest failed:', error)
    process.exit(1)
  }
}

// Run the test
testSync() 