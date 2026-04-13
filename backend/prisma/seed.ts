import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function seed() {
  const prisma = new PrismaClient();

  const existing = await prisma.admin.findFirst();
  if (existing) {
    console.log('Admin already exists:', existing.email);
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@nearbuy.com',
      passwordHash,
    },
  });

  console.log('Admin seeded:', admin.email);
  await prisma.$disconnect();
}

seed().catch(console.error);
