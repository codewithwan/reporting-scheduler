import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { getUserProfile, getUserById, findUsersByName } from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * /users/me:
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
router.get(
    "/me", 
    authenticateToken, 
    authorizeRoles("ENGINEER", "ADMIN", "SUPERADMIN"), 
    getUserProfile
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user data
 */
router.get(
    "/:id", 
    authenticateToken, 
    authorizeRoles("ADMIN", "SUPERADMIN"), 
    getUserById
);

/**
 * @swagger
 * /users/engineers:
 *   get:
 *     summary: Search engineers by name
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Engineer name
 *     responses:
 *       200:
 *         description: Engineers retrieved successfully
 *       400:
 *         description: Name query parameter is missing
 *       500:
 *         description: Failed to fetch engineers
 */
router.get(
    "/engineers", 
    authenticateToken, 
    authorizeRoles("ADMIN", "SUPERADMIN"), 
    findUsersByName
);

export default router;