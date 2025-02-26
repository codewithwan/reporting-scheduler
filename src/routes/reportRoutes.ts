import express, { Router } from "express";
import { body, param } from "express-validator";
import {
  createNewReport,
  getReports,
  getReport,
  updateReportById,
  generateReportPreview,
  engineeringSign,
  sendEmailForCustomerSign,
  customerSignReport,
  getReportsByEngineer,
  signReportDirectly,
  uploadReport,
} from "../controllers/reportController";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";
import upload from "../middleware/uploadMiddleware";
import multer from "multer";

const router = Router();

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *       500:
 *         description: Failed to retrieve reports
 */
router.get("/", authenticateToken, getReports);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Get a report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The report ID
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       404:
 *         description: Report not found
 */
router.get(
  "/:id",
  authenticateToken,
  param("id").isUUID(),
  handleValidation,
  getReport
);

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - engineerId
 *               - customerId
 *               - content
 *             properties:
 *               engineerId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ENGINEER"),
  body("engineerId").isUUID(),
  body("customerId").isUUID(),
  handleValidation,
  createNewReport
);

/**
 * @swagger
 * /reports/{id}:
 *   put:
 *     summary: Update a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report updated successfully
 *       404:
 *         description: Report not found
 */
router.put(
  "/:id",
  authenticateToken,
  param("id").isUUID(),
  body("content").isString(),
  handleValidation,
  updateReportById
);

/**
 * @swagger
 * /reports/engineering-sign:
 *   post:
 *     summary: Engineer signs a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportId
 *               - signature
 *             properties:
 *               reportId:
 *                 type: string
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report signed successfully
 *       400:
 *         description: Bad request
 */
router.post("/engineering-sign", authenticateToken, engineeringSign);

/**
 * @swagger
 * /reports/generate-preview:
 *   post:
 *     summary: Generate a report preview
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportId
 *             properties:
 *               reportId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report preview generated successfully
 *       400:
 *         description: Bad request
 */
router.post("/generate-preview", authenticateToken, generateReportPreview);

/**
 * @swagger
 * /reports/send-email-customer-sign:
 *   post:
 *     summary: Send email to customer for signing
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportId
 *               - customerEmail
 *             properties:
 *               reportId:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent to customer successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/send-email-customer-sign",
  authenticateToken,
  sendEmailForCustomerSign
);

/**
 * @swagger
 * /reports/report/customer-sign:
 *   post:
 *     summary: Customer signs a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportId
 *               - customerSignature
 *             properties:
 *               reportId:
 *                 type: string
 *               customerSignature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report signed by customer successfully
 *       400:
 *         description: Bad request
 */
router.post("/customer-sign", authenticateToken, customerSignReport);

/**
 * @swagger
 * /reports/engineer/{engineerId}:
 *   get:
 *     summary: Get a report by Engineer ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The report ID
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       404:
 *         description: Report not found
 */

router.get("/engineer/:engineerId", getReportsByEngineer);

/**
 * @swagger
 * /sign-direct:
 *   post:
 *     summary: Engineer signs report directly
 *     description: Allows an engineer to directly sign a report without customer intervention.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Report successfully signed by engineer.
 */

router.post(
  "/sign-direct",
  authenticateToken,
  authorizeRoles("ENGINEER"),
  signReportDirectly
);

// Endpoint upload file PDF
router.post(
  "/upload",
  authenticateToken,
  authorizeRoles("ENGINEER"),
  upload.single("file"),
  uploadReport
);

export default router;
