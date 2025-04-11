const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (!existingAdmin) {
      console.log('Admin user does not exist. Creating admin user...');
      
      // Create admin user with the new password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          role: 'admin',
        },
      });
      
      console.log('Admin user created with password "admin123"');
      return;
    }

    // Update admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const updatedAdmin = await prisma.user.update({
      where: { username: 'admin' },
      data: {
        password: hashedPassword,
      },
    });
    
    console.log('Admin password updated to "admin123"');
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
