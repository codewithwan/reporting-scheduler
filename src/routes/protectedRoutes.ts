import { Router, Response } from "express";
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from "../middleware/authMiddleware";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access protected route
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticateToken, authorizeRoles("ADMIN", "SUPERADMIN"), (req: AuthenticatedRequest, res: Response) => {
  logger.info(`User ${req.user?.id} accessed protected route`);
  res.status(200).json({ message: "You have access to this route" });
});

export default router;
