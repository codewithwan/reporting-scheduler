import { prisma, setTimezone } from '../config/prisma';
import { Prisma } from '@prisma/client';

async function createUser(data: Prisma.UserCreateInput) {
  await setTimezone('Asia/Jakarta');
  return prisma.user.create({ data });
}

