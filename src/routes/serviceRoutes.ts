import { Router } from "express";
import { body, param } from "express-validator";
import { getAllService } from "../controllers/serviceController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *       500:
 *         description: Failed to retrieve customers
 */
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  getAllService
);

export default router;