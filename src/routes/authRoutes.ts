import { Router } from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { register, login, createUserByAdmin } from "../controllers/authController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, // For testing
    message: "Too many attempts from this IP, please try again after 15 minutes",
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/register",
  authLimiter,
  body("name").isString().isLength({ min: 1 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post(
  "/login",
  authLimiter,
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  login
);

/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: Create a new user by admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ENGINEER, ADMIN]
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  "/create-user",
  authenticateToken,
  authorizeRoles("SUPERADMIN"),
  body("name").isString().isLength({ min: 1 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["ENGINEER", "ADMIN"]),
  createUserByAdmin
);

export default router;
