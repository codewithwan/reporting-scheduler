import { prisma } from "../config/prismaClient";
import { User } from "../models/userModel";
import { UserRole } from "@prisma/client"; // Import UserRole enum
import { validate as isUuid } from "uuid";
import logger from "../utils/logger";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole; // Update the role property type
}

interface CreateUserWithRoleInput extends CreateUserInput {}

/**
 * Finds a user by their email address.
 * @param {string} email - The email address of the user.
 * @returns {Promise<User | null>} The user object if found, otherwise null.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

/**
 * Creates a new user.
 * @param {CreateUserInput} data - The user data.
 * @returns {Promise<User>} The created user object.
 */
export const createUser: (data: CreateUserInput) => Promise<User> = async (data: CreateUserInput): Promise<User> => {
  return await prisma.user.create({ data });
};

/**
 * Creates a new user with a role.
 * @param {CreateUserWithRoleInput} data - The user data.
 * @returns {Promise<User>} The created user object.
 */
export const createUserWithRole = async (data: CreateUserWithRoleInput): Promise<User> => {
  return await prisma.user.create({ data });
};

/**
 * Retrieves all users.
 * @returns {Promise<User[]>} An array of user objects.
 */
export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

/**
 * Retrieves users based on the role of the requesting user.
 * @param {string} role - The role of the requesting user.
 * @returns {Promise<User[]>} An array of user objects.
 */
export const getUsersByRole = async (role: string): Promise<User[]> => {
  return await prisma.user.findMany({
    where: role === 'SUPERADMIN' ? {} : role === 'ADMIN' ? {
      role: {
        notIn: ["SUPERADMIN", "ADMIN"]
      }
    } : {
      role: {
        notIn: ["SUPERADMIN"]
      }
    }
  });
};

/**
 * Finds a user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {Promise<User | null>} The user object if found, otherwise null.
 */
export const findUserById = async (id: string): Promise<User | null> => {
  if (!isUuid(id)) {
    throw new Error("Invalid UUID format");
  }
  return await prisma.user.findUnique({ where: { id } });
};

/**
 * Finds engineers by their name.
 * @param {string} name - The name of the engineer.
 * @returns {Promise<User[]>} An array of user objects.
 */
export const findEngineersByName = async (name: string): Promise<User[]> => {
  logger.debug(`Searching for engineers with name containing: ${name}`);
  const engineers = await prisma.user.findMany({
    where: {
      role: 'ENGINEER',
      name: {
        contains: name,
        mode: 'insensitive'
      }
    },
  });
  logger.debug(`Engineers found:` + engineers);
  return engineers;
};

/**
 * Updates a user by their ID.
 * @param {string} id - The ID of the user.
 * @param {Partial<Omit<User, 'role' | 'Report'>> & { role?: UserRole }} data - The user data to update.
 * @returns {Promise<User>} The updated user object.
 */
export const updateUserById = async (id: string, data: Partial<Omit<User, 'role' | 'Report'>> & { role?: UserRole }): Promise<User> => {
  return await prisma.user.update({ where: { id }, data });
};

/**
 * Updates the profile of a user.
 * @param {string} id - The ID of the user.
 * @param {Partial<Omit<User, 'role' | 'Report'>> & { role?: UserRole }} data - The user data to update.
 * @returns {Promise<User>} The updated user object.
 */
export const updateUserProfile = async (id: string, data: Partial<Omit<User, 'role' | 'Report'>> & { role?: UserRole }): Promise<User> => {
  return await prisma.user.update({ where: { id }, data });
};

/**
 * Deletes a user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {Promise<void>}
 */
export const deleteUserById = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};
