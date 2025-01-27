import { Request, Response } from "express";
import { createRescheduleRequest, getRescheduleRequestsBySchedule, updateRescheduleRequestStatusById } from "../services/rescheduleService";
import { AuthenticatedRequest } from "../models/userModel";

/**
 * Create a new reschedule request.
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const createReschedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { scheduleId, reason, newDate } = req.body;
  const requestedBy = req.user!.id;

  try {
    const rescheduleRequest = await createRescheduleRequest({ scheduleId, requestedBy, reason, newDate });
    res.status(201).json(rescheduleRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to create reschedule request", error: (error as Error).message });
  }
};

/**
 * Get reschedule requests for a schedule.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const getRescheduleRequests = async (req: Request, res: Response): Promise<void> => {
  const { scheduleId } = req.params;

  try {
    const rescheduleRequests = await getRescheduleRequestsBySchedule(scheduleId);
    res.status(200).json(rescheduleRequests);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve reschedule requests", error: (error as Error).message });
  }
};

/**
 * Update the status of a reschedule request.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateRescheduleRequestStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRescheduleRequest = await updateRescheduleRequestStatusById(id, status);
    res.status(200).json(updatedRescheduleRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to update reschedule request status", error: (error as Error).message });
  }
};
