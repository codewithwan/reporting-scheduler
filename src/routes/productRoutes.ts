import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - customerId
 *               - serialNumber
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               customerId:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  body("brand").isString().isLength({ min: 1 }),
  body("model").isString().isLength({ min: 1 }),
  body("customerId").isUUID(),
  body("serialNumber").isString().isLength({ min: 1 }),
  body("description").optional().isString(),
  handleValidation,
  createProduct
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Failed to retrieve products
 */
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ENGINEER", "ADMIN", "SUPERADMIN"),
  getAllProducts
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ENGINEER", "ADMIN", "SUPERADMIN"),
  param("id").isUUID(),
  handleValidation,
  getProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               customerId:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  param("id").isUUID(),
  body("brand").optional().isString().isLength({ min: 1 }),
  body("model").optional().isString().isLength({ min: 1 }),
  body("customerId").optional().isUUID(),
  body("serialNumber").optional().isString().isLength({ min: 1 }),
  body("description").optional().isString(),
  handleValidation,
  updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  param("id").isUUID(),
  handleValidation,
  deleteProduct
);

export default router;
