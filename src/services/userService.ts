import { prisma } from "../config/prismaClient";

/**
 * Finds a user by their email address.
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

/**
 * Creates a new user.
 * @param {Object} data - The user data.
 * @param {string} data.name - The name of the user.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.password - The password of the user.
 * @returns {Promise<Object>} The created user object.
 */
export const createUser = async (data: { name: string; email: string; password: string; }) => {
  return await prisma.user.create({ data });
};

/**
 * Retrieves all users.
 * @returns {Promise<Array>} An array of user objects.
 */
export const getAllUsers = async () => {
  return await prisma.user.findMany();
};
