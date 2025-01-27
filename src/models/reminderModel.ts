/**
 * @interface Reminder
 * @property {string} id - The unique identifier for the reminder
 * @property {string} scheduleId - The ID of the associated schedule
 * @property {Date} reminderTime - The date and time when the reminder is set
 * @property {string} status - The status of the reminder (PENDING, SENT)
 * @property {string | null} phoneNumber - The phone number for the reminder
 * @property {string | null} email - The email for the reminder
 * @property {Date} createdAt - The date and time when the reminder was created
 */
export interface Reminder {
  id: string;
  scheduleId: string;
  reminderTime: Date;
  status: "PENDING" | "SENT";
  phoneNumber: string | null;
  email: string | null;
  createdAt: Date;
}

/**
 * @interface CreateReminderInput
 * @property {string} scheduleId - The ID of the associated schedule
 * @property {Date} reminderTime - The date and time when the reminder is set
 * @property {string | null} phoneNumber - The phone number for the reminder
 * @property {string | null} email - The email for the reminder
 */
export interface CreateReminderInput {
  scheduleId: string;
  reminderTime: Date;
  phoneNumber: string | null;
  email: string | null;
}
