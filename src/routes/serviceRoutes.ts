import { Router } from "express";
import { body } from "express-validator";
import { createServiceController, getAllService } from "../controllers/serviceController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API endpoints for managing services
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all available services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   name:
 *                     type: string
 *                     example: "System Check"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve services
 */
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ENGINEER", "ADMIN"),
  getAllService
);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Visual Inspection"
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Visual Inspection"
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create service
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "ENGINEER"), // Only ADMIN can create services
  body("name").notEmpty().withMessage("Service name is required"),
  handleValidation,
  createServiceController
);

export default router;
