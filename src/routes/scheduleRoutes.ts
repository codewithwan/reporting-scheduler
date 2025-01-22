import { Router } from "express";
import { body } from "express-validator";
import { createScheduleByAdmin, getSchedules, updateSchedule, deleteSchedule } from "../controllers/scheduleController";
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
router.get("/", authenticateToken, getSchedules);

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
 *               - executeAt
 *               - engineerId
 *             properties:
 *               taskName:
 *                 type: string
 *               executeAt:
 *                 type: string
 *                 format: date-time
 *               engineerId:
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
  authorizeRoles("ADMIN"),
  body("taskName").isString().isLength({ min: 6 }),
  body("executeAt").isISO8601(),
  body("engineerId").isUUID(),
  handleValidation,
  createScheduleByAdmin
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
 *               executeAt:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, RESCHEDULED]
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
  body("executeAt").optional().isISO8601(),
  body("status").optional().isIn(["PENDING", "COMPLETED", "RESCHEDULED"]),
  handleValidation,
  updateSchedule
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
router.delete("/:id", authenticateToken, authorizeRoles("SUPERADMIN"), deleteSchedule);

export default router;
