const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.reminder.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.logActivity.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
