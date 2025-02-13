import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { getUserProfile, getUserById, findUsersByName, updateEngineerSignature } from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get authenticated user's profile
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
 *         description: Internal server error
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
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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
 *         description: Engineer name to search for
 *     responses:
 *       200:
 *         description: Engineers found successfully
 *       400:
 *         description: Name query parameter is missing
 *       404:
 *         description: No engineers found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/engineers", 
    authenticateToken, 
    authorizeRoles("ADMIN", "SUPERADMIN"), 
    findUsersByName
);

/**
 * @swagger
 * /users/signature:
 *   put:
 *     summary: Update engineer's digital signature
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               signature:
 *                 type: string
 *                 description: Base64 encoded signature
 *     responses:
 *       200:
 *         description: Signature updated successfully
 *       400:
 *         description: Signature is required
 *       500:
 *         description: Internal server error
 */
router.put(
    "/signature",
    authenticateToken,
    authorizeRoles("ENGINEER"),
    updateEngineerSignature
);

export default router;
