import { Router } from "express";
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/prisma";
import logger from "../utils/logger";

const router = Router();

router.get("/profile", authenticateToken, authorizeRoles("engineer", "admin", "superadmin"), async (req: AuthenticatedRequest, res) => {
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

router.get("/", authenticateToken, authorizeRoles("admin", "superadmin"), async (req: AuthenticatedRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: req.user?.role === 'superadmin' ? {} : {
        role: {
          not: "superadmin"
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