import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Encrypt the password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 2. Create the Admin User
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {}, // If exists, do nothing
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
