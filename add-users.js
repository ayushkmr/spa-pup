const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: adminPassword,
        role: 'admin',
      },
    });
    
    console.log('Admin user created:', admin);
    
    // Create a regular user
    const userPassword = await bcrypt.hash('user123', 10);
    
    const user = await prisma.user.upsert({
      where: { username: 'user' },
      update: {},
      create: {
        username: 'user',
        password: userPassword,
        role: 'user',
      },
    });
    
    console.log('Regular user created:', user);
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
