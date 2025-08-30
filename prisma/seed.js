const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('saivyy123', 12);
  await prisma.user.upsert({
    where: { email: 'founder@saivyytechnologies.in' },
    update: {},
    create: { 
      email: 'founder@saivyytechnologies.in', 
      passwordHash: hash, 
      role: 'ADMIN', 
      name: 'Admin User' 
    },
  });
  console.log('Admin user seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });