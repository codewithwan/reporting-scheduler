import { Router } from "express";
import { body } from "express-validator";
import { updateReminder } from "../controllers/reminderController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { handleValidation } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @swagger
 * /reminders/{id}:
 *   patch:
 *     summary: Update the phone number and/or reminder time for a reminder
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
 *               reminderTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Reminder updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles("ENGINEER"),
  body("phoneNumber").optional().isString(),
  body("reminderTime").optional().isISO8601(),
  handleValidation,
  updateReminder
);

export default router;
