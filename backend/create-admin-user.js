const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      
      // Update admin password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.update({
        where: { username: 'admin' },
        data: {
          password: hashedPassword,
        },
      });
      
      console.log('Admin password updated to "admin123"');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('Admin user created with password "admin123"');
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
