import { Request, Response } from "express";
import logger from "../utils/logger";
import { createSchedule, getSchedulesByUser, updateScheduleById, deleteScheduleById } from "../services/scheduleService";
import { AuthenticatedRequest } from "../models/userModel";

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
    res.status(403).json({ message: "Only admins can create schedules" });
    return;
  }

  try {
    const schedule = await createSchedule({ taskName, executeAt, engineerId, adminId });
    logger.info(`Schedule ${schedule.id} created successfully by admin ${adminId}`);
    res.status(201).json(schedule);
  } catch (error) {
    logger.error("Failed to create schedule", { error });
    res.status(500).json({ message: "Failed to create schedule", error: (error as Error).message });
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
    res.status(200).json(schedules);
  } catch (error) {
    logger.error("Failed to retrieve schedules", { error });
    res.status(500).json({ message: "Failed to retrieve schedules", error: (error as Error).message });
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
    res.status(403).json({ message: "Only superadmins can update schedules" });
    return;
  }

  try {
    const updatedSchedule = await updateScheduleById(id, { taskName, executeAt, status });
    res.status(200).json(updatedSchedule);
  } catch (error) {
    logger.error("Failed to update schedule", { error, id });
    res.status(500).json({ message: "Failed to update schedule", error: (error as Error).message });
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
    await deleteScheduleById(id);
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete schedule", { error, id });
    res.status(500).json({ message: "Failed to delete schedule", error: (error as Error).message });
  }
};
