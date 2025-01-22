import { PrismaClient } from "@prisma/client";
import { Schedule, CreateScheduleInput } from "../models/scheduleModel";

const prisma = new PrismaClient();

/**
 * Create a new schedule.
 * @param {CreateScheduleInput} data - The data for creating a new schedule
 * @returns {Promise<Schedule>} - The created schedule
 */
export const createSchedule = async (data: CreateScheduleInput): Promise<Schedule> => {
  return prisma.schedule.create({
    data,
  });
};

/**
 * Get schedules for a user.
 * @param {string} userId - The ID of the user
 * @returns {Promise<Schedule[]>} - The list of schedules for the user
 */
export const getSchedulesByUser = async (userId: string): Promise<Schedule[]> => {
  return prisma.schedule.findMany({
    where: {
      OR: [
        { engineerId: userId },
        { adminId: userId },
      ],
    },
  });
};

/**
 * Update a schedule by ID.
 * @param {string} id - The ID of the schedule to update
 * @param {Partial<Schedule>} data - The data to update the schedule with
 * @returns {Promise<Schedule>} - The updated schedule
 */
export const updateScheduleById = async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
  return prisma.schedule.update({
    where: { id },
    data,
  });
};

/**
 * Delete a schedule by ID.
 * @param {string} id - The ID of the schedule to delete
 * @returns {Promise<boolean>} - Whether the schedule was deleted successfully
 */
export const deleteScheduleById = async (id: string): Promise<boolean> => {
  const result = await prisma.schedule.delete({
    where: { id },
  });
  return result !== null;
};
