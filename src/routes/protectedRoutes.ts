import { Router, Response } from "express";
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from "../middleware/authMiddleware";
import { createUserWithRole, updateUserById, deleteUserById } from "../services/userService";
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
router.post("/users", authenticateToken, authorizeRoles("ADMIN", "SUPERADMIN"), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  try {
    const user = await createUserWithRole({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    logger.error("Failed to create user", { error });
    res.status(500).json({ message: "Failed to create user", error: (error as Error).message });
  }
});

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
router.put("/users/:id", authenticateToken, authorizeRoles("ADMIN", "SUPERADMIN"), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const user = await updateUserById(id, { name, email, role });
    res.status(200).json(user);
  } catch (error) {
    logger.error("Failed to update user", { error, id });
    res.status(500).json({ message: "Failed to update user", error: (error as Error).message });
  }
});

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
router.delete("/users/:id", authenticateToken, authorizeRoles("ADMIN", "SUPERADMIN"), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteUserById(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete user", { error, id });
    res.status(500).json({ message: "Failed to delete user", error: (error as Error).message });
  }
});

export default router;
