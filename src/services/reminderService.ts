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
    data,
  });
};

/**
 * Update the phone number for a reminder by ID.
 * @param {string} id - The ID of the reminder
 * @param {string} phoneNumber - The new phone number
 * @returns {Promise<Reminder>} - The updated reminder
 */
export const updateReminderPhoneNumberById = async (id: string, phoneNumber: string): Promise<Reminder> => {
  return prisma.reminder.update({
    where: { id },
    data: { phoneNumber },
  });
};

/**
 * Update the reminder time by ID.
 * @param {string} id - The ID of the reminder
 * @param {Date} reminderTime - The new reminder time
 * @returns {Promise<Reminder>} - The updated reminder
 */
export const updateReminderTimeById = async (id: string, reminderTime: Date): Promise<Reminder> => {
  return prisma.reminder.update({
    where: { id },
    data: { reminderTime },
  });
};
