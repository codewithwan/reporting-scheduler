import { Request, Response } from "express";
import { findUserById } from "../services/userService";
import logger from "../utils/logger";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

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

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const user = await findUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (req.user?.role === 'ADMIN' && user.role === 'ADMIN') {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error("Failed to fetch user data", { error, id });
    res.status(500).json({ message: "Failed to fetch user data", error: (error as Error).message });
  }
};
