import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    // Delete all existing admins
    await prisma.admin.deleteMany({});
    
    // Create new admin with known credentials
    const defaultUsername = 'admin';
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const admin = await prisma.admin.create({
      data: {
        username: defaultUsername,
        passwordHash: hashedPassword,
      },
    });

    console.log('✅ Admin password berhasil direset!');
    console.log('📝 Username:', defaultUsername);
    console.log('🔑 Password:', defaultPassword);
    console.log('⚠️  Silakan login dengan credentials ini di admin panel');
    console.log('📍 Admin URL: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error reset password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();