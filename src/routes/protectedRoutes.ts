import { Router, Response } from "express";
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from "../middleware/authMiddleware";
import logger from "../utils/logger";

const router = Router();

router.get("/", authenticateToken, authorizeRoles("admin", "supervisor"), (req: AuthenticatedRequest, res: Response) => {
  logger.info(`User ${req.user?.id} accessed protected route`);
  res.status(200).json({ message: "You have access to this route" });
});

export default router;
