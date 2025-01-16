import { prisma, setTimezone } from './prismaClient';
import { Prisma } from '@prisma/client';

async function createUser(data: Prisma.UserCreateInput) {
  await setTimezone('Asia/Jakarta');
  return prisma.user.create({ data });
}

