import 'dotenv/config';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@roofleadspro.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@roofleadspro.com',
      password: hashedPassword,
      role: 'ADMIN',
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser(); 