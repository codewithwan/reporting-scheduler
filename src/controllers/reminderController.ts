import { Response } from "express";
import { updateReminderById } from "../services/reminderService";
import { AuthenticatedRequest } from "../models/userModel";

/**
 * Update the phone number and/or reminder time for a reminder.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { phoneNumber, reminderTime } = req.body;

  try {
    const updatedReminder = await updateReminderById(id, phoneNumber, reminderTime ? new Date(reminderTime) : undefined);
    if (!updatedReminder) {
      res.status(404).json({ message: "Reminder not found." });
      return;
    }
    res.status(200).json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update reminder.", error: (error as Error).message });
  }
};
