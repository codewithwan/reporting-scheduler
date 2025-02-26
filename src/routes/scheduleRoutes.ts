import { Router } from "express";
import { body } from "express-validator";
import { createScheduleByAdmin, getSchedules, updateSchedule, deleteSchedule, updateScheduleStatus, getSchedule } from "../controllers/scheduleController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Get schedules for the authenticated user
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
 *       500:
 *         description: Failed to retrieve schedules
 */
router.get(
  "/", 
  authenticateToken, 
  getSchedules
);

/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a new schedule by admin
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskName
 *               - startDate
 *               - endDate
 *               - engineerId
 *               - customerId
 *               - location
 *               - activity
 *               - adminName
 *               - engineerName
 *               - phoneNumber
 *             properties:
 *               taskName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               engineerId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               productId:
 *                 type: string
 *               location:
 *                 type: string
 *               activity:
 *                 type: string
 *               adminName:
 *                 type: string
 *               engineerName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "ENGINEER"),
  body("taskName").isString().isLength({ min: 6 }),
  body("startDate").isISO8601(),
  body("endDate").isISO8601(),
  body("engineerId").isUUID(),
  body("customerId").isUUID(),
  body("productId").optional().isUUID(),
  body("location").isString(),
  body("activity").isString(),
  handleValidation,
  createScheduleByAdmin
);

/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     summary: Get a schedule by ID with detailed customer and product information
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Failed to retrieve schedule
 */
router.get(
  "/:id",
  authenticateToken,
  getSchedule
);

/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     summary: Update a schedule by superadmin
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED, RESCHEDULED, PENDING, CANCELED]
 *               location:
 *                 type: string
 *               activity:
 *                 type: string
 *               adminName:
 *                 type: string
 *               engineerName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       403:
 *         description: Forbidden
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("SUPERADMIN"),
  body("taskName").optional().isString().isLength({ min: 1 }),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("status").optional().isIn(["ACCEPTED", "REJECTED", "RESCHEDULED", "PENDING", "CANCELED"]),
  body("location").optional().isString(),
  body("activity").optional().isString(),
  body("adminName").optional().isString(),
  body("engineerName").optional().isString(),
  body("phoneNumber").optional().isString(),
  handleValidation,
  updateSchedule
);

/**
 * @swagger
 * /schedules/{id}/status:
 *   patch:
 *     summary: Update the status of a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED, RESCHEDULED, PENDING, CANCELED]
 *     responses:
 *       200:
 *         description: Schedule status updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/:id/status",
  authenticateToken,
  body("status").isIn(["ACCEPTED", "REJECTED", "RESCHEDULED", "PENDING", "CANCELED", "COMPLETED"]),
  handleValidation,
  updateScheduleStatus
);

/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: Delete a schedule by superadmin
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/:id", 
  authenticateToken, 
  authorizeRoles("SUPERADMIN"), 
  deleteSchedule
);

export default router;
