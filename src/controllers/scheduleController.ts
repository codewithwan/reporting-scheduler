import { Request, Response } from "express";
import logger from "../utils/logger";
import { createSchedule, getSchedulesByUser, updateScheduleById, deleteScheduleById } from "../services/scheduleService";
import { AuthenticatedRequest } from "../models/userModel";
import { CreateScheduleInput } from "../models/scheduleModel";

/**
 * Create a new schedule.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const createScheduleByAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { taskName, executeAt, engineerId } = req.body;
  const adminId = req.user!.id;

  if (req.user!.role !== "ADMIN") {
    res.status(403).json({ message: "Access denied. Only admins can create schedules." });
    return;
  }

  if (!taskName || !executeAt || !engineerId) {
    res.status(400).json({ message: "Invalid input. Please provide task name, execution time, and engineer ID." });
    return;
  }

  try {
    const schedule = await createSchedule({ taskName, executeAt, engineerId, adminId });
    if (!schedule) {
      res.status(404).json({ message: "Creation failed. Engineer ID not found." });
      return;
    }
    logger.info(`Schedule ${schedule.id} created successfully by admin ${adminId}`);
    res.status(201).json(schedule);
  } catch (error) {
    if ((error as Error).message.includes("Foreign key constraint violated")) {
      res.status(400).json({ message: "Invalid engineer ID. Please check the engineer ID and try again." });
    } else if ((error as Error).message.includes("Reminder time cannot be in the past")) {
      res.status(400).json({ message: "Reminder time cannot be in the past. Please set a valid reminder time." });
    } else {
      logger.error("Failed to create schedule", { error });
      res.status(500).json({ message: "An unexpected error occurred while creating the schedule. Please try again later.", error: (error as Error).message });
    }
  }
};

/**
 * Get schedules for the authenticated user.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const getSchedules = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const schedules = await getSchedulesByUser(req.user!.id);
    if (!schedules.length) {
      res.status(404).json({ message: "No schedules found for the current user." });
      return;
    }
    res.status(200).json(schedules);
  } catch (error) {
    logger.error("Failed to retrieve schedules", { error });
    res.status(500).json({ message: "An unexpected error occurred while retrieving schedules. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Update a schedule.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { taskName, executeAt, status } = req.body;

  if (req.user!.role !== "SUPERADMIN") {
    res.status(403).json({ message: "Access denied. Only superadmins can update schedules." });
    return;
  }

  try {
    const updatedSchedule = await updateScheduleById(id, { taskName, executeAt, status });
    if (!updatedSchedule) {
      res.status(404).json({ message: "Update failed. Schedule not found." });
      return;
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    logger.error("Failed to update schedule", { error, id });
    res.status(500).json({ message: "An unexpected error occurred while updating the schedule. Please try again later.", error: (error as Error).message });
  }
};

/**
 * Delete a schedule.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const deleteSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (req.user!.role !== "SUPERADMIN") {
    res.status(403).json({ message: "Only superadmins can delete schedules" });
    return;
  }

  try {
    const deleted = await deleteScheduleById(id);
    if (!deleted) {
      res.status(404).json({ message: "Schedule not found" });
      return;
    }
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete schedule", { error, id });
    res.status(500).json({ message: "Failed to delete schedule", error: (error as Error).message });
  }
};
