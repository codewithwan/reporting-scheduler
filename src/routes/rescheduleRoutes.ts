import { Router } from "express";
import { body } from "express-validator";
import { createReschedule, getRescheduleRequests, updateRescheduleRequestStatus } from "../controllers/rescheduleController";
import { authenticateToken } from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @swagger
 * /reschedules:
 *   post:
 *     summary: Create a new reschedule request
 *     tags: [Reschedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - reason
 *               - newDate
 *             properties:
 *               scheduleId:
 *                 type: string
 *               reason:
 *                 type: string
 *               newDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reschedule request created successfully
 *       500:
 *         description: Failed to create reschedule request
 */
router.post(
  "/",
  authenticateToken,
  body("scheduleId").isUUID(),
  body("reason").isString(),
  body("newDate").isISO8601(),
  handleValidation,
  createReschedule
);

/**
 * @swagger
 * /reschedules/{scheduleId}:
 *   get:
 *     summary: Get reschedule requests for a schedule
 *     tags: [Reschedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Reschedule requests retrieved successfully
 *       500:
 *         description: Failed to retrieve reschedule requests
 */
router.get("/:scheduleId", authenticateToken, getRescheduleRequests);

/**
 * @swagger
 * /reschedules/{id}/status:
 *   patch:
 *     summary: Update the status of a reschedule request
 *     tags: [Reschedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reschedule request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Reschedule request status updated successfully
 *       500:
 *         description: Failed to update reschedule request status
 */
router.patch(
  "/:id/status",
  authenticateToken,
  body("status").isIn(["PENDING", "APPROVED", "REJECTED"]),
  handleValidation,
  updateRescheduleRequestStatus
);

export default router;
