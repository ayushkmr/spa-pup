const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node update-user-password.js <username> <new_password>');
  process.exit(1);
}

const username = args[0];
const newPassword = args[1];

async function updateUserPassword(username, newPassword) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      console.log(`User ${username} does not exist.`);
      return;
    }

    // Update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { username },
      data: {
        password: hashedPassword,
      },
    });
    
    console.log(`Password updated for user ${username}`);
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPassword(username, newPassword);
