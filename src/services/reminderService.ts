import { PrismaClient, Reminder, ReminderStatus } from "@prisma/client";
import { CreateReminderInput } from "../models/reminderModel";
import { sendEmailWithTemplate } from "../utils/emailService"; 
import logger from "../utils/logger";

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

/**
 * Send pending reminders and update their status to SENT.
 * @returns {Promise<void>}
 */
export const sendPendingReminders = async (): Promise<void> => {
  try {
    const pendingReminders = await prisma.reminder.findMany({
      where: { status: ReminderStatus.PENDING },
      include: { schedule: { include: { customer: true } } }, 
    });
    for (const reminder of pendingReminders) {
      if (reminder.email) {
        const schedule = reminder.schedule;
        const emailSubject = `Reminder Schedule for ${schedule.taskName}`;
        const templateData = {
          taskName: schedule.taskName,
          customerName: schedule.customer.name,
          location: schedule.location,
          activity: schedule.activity,
          scheduledTime: schedule.executeAt.toString(),
        };

        await sendEmailWithTemplate(reminder.email, emailSubject, "reminder", templateData);

        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { status: ReminderStatus.SENT },
        });
      }
    }
  } catch (error) {
    logger.error("Failed to send pending reminders", error);
    throw new Error("Failed to send pending reminders. Please try again later.");
  }
};

