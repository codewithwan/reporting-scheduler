import { Response } from "express";
import { updateReminderPhoneNumberById, updateReminderTimeById } from "../services/reminderService";
import { AuthenticatedRequest } from "../models/userModel";

/**
 * Update the phone number for a reminder.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateReminderPhoneNumber = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { phoneNumber } = req.body;

  try {
    const updatedReminder = await updateReminderPhoneNumberById(id, phoneNumber);
    if (!updatedReminder) {
      res.status(404).json({ message: "Reminder not found." });
      return;
    }
    res.status(200).json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update reminder phone number.", error: (error as Error).message });
  }
};

/**
 * Update the reminder time.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateReminderTime = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { reminderTime } = req.body;

  try {
    const updatedReminder = await updateReminderTimeById(id, new Date(reminderTime));
    if (!updatedReminder) {
      res.status(404).json({ message: "Reminder not found." });
      return;
    }
    res.status(200).json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update reminder time.", error: (error as Error).message });
  }
};
