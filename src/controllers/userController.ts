import { Request, Response } from "express";
import { findUserById, findEngineersByName as findEngineersByNameService } from "../services/userService";
import logger from "../utils/logger";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


/**
 * Get the profile of the authenticated user.
 * @param {AuthenticatedRequest} req - The request object, containing the authenticated user.
 * @param {Response} res - The response object.
 */
export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "User ID is missing" });
    return;
  }
  try {
    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error("Failed to fetch user data", { error, userId });
    res.status(500).json({ message: "Failed to fetch user data", error: (error as Error).message });
  }
};

/**
 * Get a user by their ID.
 * @param {AuthenticatedRequest} req - The request object, containing the user ID in the params.
 * @param {Response} res - The response object.
 */
export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const user = await findUserById(id);
    if (!user || (req.user?.role === 'ADMIN' && (user.role === 'ADMIN' || user.role === 'SUPERADMIN'))) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error("Failed to fetch user data", { error, id });
    res.status(500).json({ message: "Failed to fetch user data", error: (error as Error).message });
  }
};

/**
 * Find users by their name.
 * @param {Request} req - The request object, containing the name query parameter.
 * @param {Response} res - The response object.
 */
export const findUsersByName = async (req: Request, res: Response) => {
  const { name } = req.query;
  logger.debug(`Query parameter 'name': ${name}`);
  if (!name) {
    res.status(400).json({ message: "Name query parameter is missing" });
    return;
  }
  try {
    const engineers = await findEngineersByNameService(name as string);
    logger.debug(`Engineers found: ${JSON.stringify(engineers)}`);
    if (engineers.length === 0) {
      res.status(404).json({ message: "No engineers found" });
      return;
    }
    res.status(200).json(engineers);
  } catch (error) {
    logger.error("Failed to fetch engineers", { error, name });
    res.status(500).json({ message: "Failed to fetch engineers", error: (error as Error).message });
  }
};

export const updateEngineerSignature = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { signature } = req.body;
  const userId = req.user?.id; // From auth middleware

  if (!signature) {
    res.status(400).json({ message: "Signature is required" });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { signature }
    }) as any;

    logger.info(`Updated signature for engineer ${userId}`);
    res.status(200).json({ 
      message: "Signature updated successfully",
      signature: updatedUser.signature 
    });
  } catch (error) {
    logger.error("Failed to update engineer signature", { error });
    res.status(500).json({ 
      message: "Failed to update signature", 
      error: (error as Error).message 
    });
  }
};