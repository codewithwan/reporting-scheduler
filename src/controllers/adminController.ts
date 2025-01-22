import { Response } from "express";
import bcrypt from "bcryptjs";
import logger from "../utils/logger";
import { createUserWithRole, updateUserById, deleteUserById, updateUserProfile, getUsersByRole, findUserByEmail, findUserById } from "../services/userService";
import { AuthenticatedRequest } from "../models/userModel";

/**
 * Create a new user.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  if (req.user!.role === "ADMIN" && (role === "ADMIN" || role === "SUPERADMIN")) {
    res.status(403).json({ message: "Access denied. Admins cannot create other admins or superadmins." });
    return;
  }
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "This email is already registered. Please use a different email." });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserWithRole({ name, email, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    logger.error("Failed to create user", { error });
    res.status(500).json({ message: "An unexpected error occurred during user creation. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Update a user.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  if (req.user!.role === "ADMIN" && (role === "ADMIN" || role === "SUPERADMIN")) {
    res.status(403).json({ message: "Access denied. Admins cannot update other admins or superadmins." });
    return;
  }
  try {
    const user = await findUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found. Please check the user ID and try again." });
      return;
    }
    const updatedUser = await updateUserById(id, { name, email, role });
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error("Failed to update user", { error, id });
    res.status(500).json({ message: "An unexpected error occurred during user update. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Delete a user.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteUserById(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    logger.error("Failed to delete user", { error, id });
    res.status(500).json({ message: "An unexpected error occurred during user deletion. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Update profile.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.user!;
  const { name, email } = req.body;
  try {
    const user = await updateUserProfile(id, { name, email });
    res.status(200).json(user);
  } catch (error) {
    logger.error("Failed to update profile", { error, id });
    res.status(500).json({ message: "An unexpected error occurred during profile update. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Get all users.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await getUsersByRole(req.user!.role);
    res.status(200).json(users);
  } catch (error) {
    logger.error("Failed to retrieve users", { error });
    res.status(500).json({ message: "An unexpected error occurred while retrieving users. Please try again later.", error: (error as Error).message });
  }
};
