import { Router, Response } from "express";
import { body, param } from "express-validator";
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";
import { createUser, updateUser, deleteUser, updateProfile, getUsers } from "../controllers/adminController";
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

/**
 * @swagger
 * /protected/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Protected]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to create user
 */
router.post(
  "/users",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  body("name").isString().isLength({ min: 1 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("role").isIn(["ENGINEER", "ADMIN", "SUPERADMIN"]),
  handleValidation,
  createUser
);

/**
 * @swagger
 * /protected/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update user
 */
router.put(
  "/users/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  param("id").isUUID(),
  body("name").isString().isLength({ min: 1 }),
  body("email").isEmail(),
  body("role").isIn(["ENGINEER", "ADMIN", "SUPERADMIN"]),
  handleValidation,
  updateUser
);

/**
 * @swagger
 * /protected/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Protected]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  param("id").isUUID(),
  handleValidation,
  deleteUser
);

/**
 * @swagger
 * /protected/profile:
 *   put:
 *     summary: Update profile
 *     tags: [Protected]
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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to update profile
 */
router.put(
  "/profile",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  body("name").isString().isLength({ min: 1 }),
  body("email").isEmail(),
  handleValidation,
  updateProfile
);

/**
 * @swagger
 * /protected/users:
 *   get:
 *     summary: Get all users
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Failed to retrieve users
 */
router.get(
  "/users", 
  authenticateToken, 
  authorizeRoles("ADMIN", "SUPERADMIN"), 
  getUsers
);

export default router;
