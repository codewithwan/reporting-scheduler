import { PrismaClient } from "@prisma/client";
import { RescheduleRequest, CreateRescheduleRequestInput } from "../models/rescheduleModel";

const prisma = new PrismaClient();

/**
 * Create a new reschedule request.
 * @param {CreateRescheduleRequestInput} data - The data for creating a new reschedule request
 * @returns {Promise<RescheduleRequest>} - The created reschedule request
 */
export const createRescheduleRequest = async (data: CreateRescheduleRequestInput): Promise<RescheduleRequest> => {
  return prisma.rescheduleRequest.create({
    data,
  });
};

/**
 * Get reschedule requests for a schedule.
 * @param {string} scheduleId - The ID of the schedule
 * @returns {Promise<RescheduleRequest[]>} - The list of reschedule requests for the schedule
 */
export const getRescheduleRequestsBySchedule = async (scheduleId: string): Promise<RescheduleRequest[]> => {
  return prisma.rescheduleRequest.findMany({
    where: { scheduleId },
  });
};

/**
 * Get all reschedule requests.
 * @returns {Promise<RescheduleRequest[]>} - The list of all reschedule requests
 */
export const getAllRescheduleRequests = async (): Promise<RescheduleRequest[]> => {
  return prisma.rescheduleRequest.findMany();
};

/**
 * Update the status of a reschedule request by ID.
 * @param {string} id - The ID of the reschedule request to update
 * @param {string} status - The new status of the reschedule request
 * @returns {Promise<RescheduleRequest>} - The updated reschedule request
 */
export const updateRescheduleRequestStatusById = async (id: string, status: "PENDING" | "APPROVED" | "REJECTED"): Promise<RescheduleRequest> => {
  return prisma.rescheduleRequest.update({
    where: { id },
    data: { status },
  });
};
