import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst();
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.username);
      return;
    }

    // Create default admin
    const defaultUsername = 'admin';
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const admin = await prisma.admin.create({
      data: {
        username: defaultUsername,
        passwordHash: hashedPassword,
      },
    });

    console.log('Default admin created successfully!');
    console.log('Username:', defaultUsername);
    console.log('Password:', defaultPassword);
    console.log('Please change the password after first login.');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();