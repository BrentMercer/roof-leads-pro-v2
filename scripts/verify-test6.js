const mongoose = require('mongoose');
require('dotenv').config();

async function verifyEmail() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find and update the user
    const result = await mongoose.connection.collection('users').updateOne(
      { email: 'brentonjmercer+test6@gmail.com' },
      { 
        $set: { 
          emailVerified: new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log('User not found');
    } else if (result.modifiedCount === 0) {
      console.log('User already verified');
    } else {
      console.log('User email verified successfully');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

verifyEmail(); 