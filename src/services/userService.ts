import prisma from "../config/prisma";

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};
