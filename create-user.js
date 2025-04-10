const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('user123', 10);

    const user = await prisma.user.upsert({
      where: { username: 'user' },
      update: {},
      create: {
        username: 'user',
        password: hashedPassword,
        role: 'user',
      },
    });

    console.log('Regular user created:', user);
  } catch (error) {
    console.error('Error creating regular user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
