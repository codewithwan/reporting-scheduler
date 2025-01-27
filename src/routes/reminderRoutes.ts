import { Router } from "express";
import { body } from "express-validator";
import { updateReminderPhoneNumber, updateReminderTime } from "../controllers/reminderController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @swagger
 * /reminders/{id}/phoneNumber:
 *   patch:
 *     summary: Update the phone number for a reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reminder ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reminder phone number updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/:id/phoneNumber",
  authenticateToken,
  authorizeRoles("ENGINEER"),
  body("phoneNumber").isString(),
  handleValidation,
  updateReminderPhoneNumber
);

/**
 * @swagger
 * /reminders/{id}/reminderTime:
 *   patch:
 *     summary: Update the reminder time
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reminder ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reminderTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Reminder time updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/:id/reminderTime",
  authenticateToken,
  authorizeRoles("ENGINEER"),
  body("reminderTime").isISO8601(),
  handleValidation,
  updateReminderTime
);

export default router;
