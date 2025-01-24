import { PrismaClient, ScheduleStatus } from "@prisma/client"; // Import ScheduleStatus
import { Schedule, CreateScheduleInput } from "../models/scheduleModel";
import { createReminder } from "./reminderService";

const prisma = new PrismaClient();

/**
 * Create a new schedule.
 * @param {CreateScheduleInput} data - The data for creating a new schedule
 * @returns {Promise<Schedule>} - The created schedule
 */
export const createSchedule = async (data: CreateScheduleInput): Promise<Schedule> => {
  const admin = await prisma.user.findUnique({ where: { id: data.adminId } });
  const engineer = await prisma.user.findUnique({ where: { id: data.engineerId } });

  if (!admin || !engineer) {
    throw new Error("Invalid admin or engineer ID");
  }

  const schedule = await prisma.schedule.create({
    data: {
      taskName: data.taskName,
      executeAt: data.executeAt,
      engineerId: data.engineerId,
      adminId: data.adminId,
      location: data.location,
      activity: data.activity,
      adminName: admin.name,
      engineerName: engineer.name,
      phoneNumber: data.phoneNumber,
    },
  });

  // Assume sendNotification is a function that sends notifications
  // await sendNotification(data.engineerId, `New schedule requested: ${data.taskName}`);

  return schedule;
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
    select: {
      id: true,
      taskName: true,
      executeAt: true,
      engineerId: true,
      adminId: true,
      location: true,
      activity: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      adminName: true,
      engineerName: true,
      phoneNumber: true,
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
  const schedule = await prisma.schedule.update({
    where: { id },
    data,
  });

  if (data.status) {
    const now = new Date();
    if (data.status === "ACCEPTED") {
      const reminderTime = new Date(schedule.executeAt);
      reminderTime.setDate(reminderTime.getDate() - 1);
      if (reminderTime > now) {
        await createReminder({
          scheduleId: schedule.id,
          reminderTime,
        });
      }
    }
    // Assume sendNotification is a function that sends notifications
    // await sendNotification(schedule.engineerId, `Schedule ${data.status.toLowerCase()}: ${schedule.taskName}`);
  }

  return schedule;
};

/**
 * Update the status of a schedule by ID.
 * @param {string} id - The ID of the schedule to update
 * @param {ScheduleStatus} status - The new status of the schedule
 * @returns {Promise<Schedule>} - The updated schedule
 */
export const updateScheduleStatusById = async (id: string, status: ScheduleStatus): Promise<Schedule> => {
  const schedule = await prisma.schedule.update({
    where: { id },
    data: { status },
  });

  const now = new Date();
  if (status === "ACCEPTED") {
    const reminderTime = new Date(schedule.executeAt);
    reminderTime.setDate(reminderTime.getDate() - 1);
    if (reminderTime > now) {
      await createReminder({
        scheduleId: schedule.id,
        reminderTime,
      });
    }
  }
  // Assume sendNotification is a function that sends notifications
  // await sendNotification(schedule.engineerId, `Schedule ${status.toLowerCase()}: ${schedule.taskName}`);

  return schedule;
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
