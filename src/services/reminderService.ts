import { PrismaClient, Reminder, ReminderStatus } from "@prisma/client";
import { CreateReminderInput } from "../models/reminderModel";
import { sendEmail } from "../utils/mailer"; // Import sendEmail utility

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
 */
export const sendPendingReminders = async (): Promise<void> => {
  const pendingReminders = await prisma.reminder.findMany({
    where: { status: ReminderStatus.PENDING },
    include: { schedule: { include: { customer: true } } }, 
  });

  for (const reminder of pendingReminders) {
    if (reminder.email) {
      const schedule = reminder.schedule;
      const emailSubject = `Reminder Schedule for ${schedule.taskName}`;
      const emailText = `
        This is a reminder for your scheduled task.
        
        Task Name: ${schedule.taskName}
        Customer: ${schedule.customer.name}
        Location: ${schedule.location}
        Activity: ${schedule.activity}
        Scheduled Time: ${schedule.executeAt}
      `;
      const emailHtml = `
        <p>This is a reminder for your scheduled task.</p>
        to: reminder.email,
        <p><strong>Task Name:</strong> ${schedule.taskName}</p>
        <p><strong>Customer:</strong> ${schedule.customer.name}</p>
        <p><strong>Location:</strong> ${schedule.location}</p>
        <p><strong>Activity:</strong> ${schedule.activity}</p>
        <p><strong>Scheduled Time:</strong> ${schedule.executeAt}</p>
      `;

      await sendEmail({
        to: reminder.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });

      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { status: ReminderStatus.SENT },
      });
    }
  }
};

