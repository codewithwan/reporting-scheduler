import { PrismaClient, Reminder } from "@prisma/client";
import { CreateReminderInput } from "../models/reminderModel";

const prisma = new PrismaClient();

/**
 * Create a new reminder.
 * @param {CreateReminderInput} data - The data for creating a new reminder
 * @returns {Promise<Reminder>} - The created reminder
 */
export const createReminder = async (data: CreateReminderInput): Promise<Reminder> => {
  return prisma.reminder.create({
    data: {
      ...data,
      email: data.email ?? "",
    },
  });
};

/**
 * Update the phone number and/or reminder time for a reminder by ID.
 * @param {string} id - The ID of the reminder
 * @param {string} phoneNumber - The new phone number
 * @param {Date} [reminderTime] - The new reminder time
 * @returns {Promise<Reminder>} - The updated reminder
 */
export const updateReminderById = async (id: string, phoneNumber: string, reminderTime?: Date): Promise<Reminder> => {
  const data: any = { phoneNumber };
  if (reminderTime) {
    data.reminderTime = reminderTime;
  }
  return prisma.reminder.update({
    where: { id },
    data,
  });
};
