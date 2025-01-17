import { Router } from "express";
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/prismaClient";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       400:
 *         description: User ID is missing
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user data
 */
router.get("/profile", authenticateToken, authorizeRoles("ENGINEER", "ADMIN", "SUPERADMIN"), async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true, timezone: true } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      logger.error("Failed to fetch user data", { error, userId });
      res.status(500).json({ message: "Failed to fetch user data", error: (error as Error).message });
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Failed to fetch users data
 */
router.get("/", authenticateToken, authorizeRoles("SUPERADMIN"), async (req: AuthenticatedRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: req.user?.role === 'SUPERADMIN' ? {} : {
        role: {
          not: "SUPERADMIN"
        }
      }
    });
    res.status(200).json(users);
  } catch (error) {
    logger.error("Failed to fetch users data", { error });
    res.status(500).json({ message: "Failed to fetch users data", error: (error as Error).message });
  }
});

export default router;