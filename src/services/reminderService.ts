import { PrismaClient } from "@prisma/client";
import { Reminder, CreateReminderInput } from "../models/reminderModel";

const prisma = new PrismaClient();

/**
 * Create a new reminder.
 * @param {CreateReminderInput} data - The data for creating a new reminder
 * @returns {Promise<Reminder>} - The created reminder
 * @throws {Error} - If the reminder time is in the past
 */
export const createReminder = async (data: CreateReminderInput): Promise<Reminder> => {
  const now = new Date();
  if (data.reminderTime < now) {
    throw new Error("Reminder time cannot be in the past.");
  }

  return prisma.reminder.create({
    data,
  });
};
