import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setTimezone(timezone: string) {
  await prisma.$executeRaw`SET TIMEZONE TO ${timezone}`;
}

export { prisma, setTimezone };
