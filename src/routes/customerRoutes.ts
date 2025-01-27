import { Router } from "express";
import { body, param } from "express-validator";
import { createCustomer, getCustomer, getAllCustomers, updateCustomer, deleteCustomer } from "../controllers/customerController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
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
 *               - company
 *               - email
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  body("name").isString().isLength({ min: 1 }),
  body("company").isString().isLength({ min: 1 }),
  body("email").isEmail(),
  body("phoneNumber").isString().isLength({ min: 10 }),
  body("position").optional().isString(),
  body("address").optional().isString(),
  handleValidation,
  createCustomer
);

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
  getAllCustomers
);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *       404:
 *         description: Customer not found
 */
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  param("id").isUUID(),
  handleValidation,
  getCustomer
);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  param("id").isUUID(),
  body("name").optional().isString().isLength({ min: 1 }),
  body("company").optional().isString().isLength({ min: 1 }),
  body("email").optional().isEmail(),
  body("phoneNumber").optional().isString().isLength({ min: 10 }),
  body("position").optional().isString(),
  body("address").optional().isString(),
  handleValidation,
  updateCustomer
);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  param("id").isUUID(),
  handleValidation,
  deleteCustomer
);

export default router;
