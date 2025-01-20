import { prisma } from "../config/prismaClient";

/**
 * Checks the health of the database connection.
 * @returns {Promise<boolean>} True if the database connection is healthy, otherwise false.
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
};
