const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function checkUsers() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get users collection
    const users = await mongoose.connection.collection('users').find({}).toArray();
    
    console.log('\nTotal users:', users.length);
    console.log('\nUser details (excluding sensitive data):');
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      // Print non-sensitive user data
      const safeUser = {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      console.log(JSON.stringify(safeUser, null, 2));
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkUsers(); 