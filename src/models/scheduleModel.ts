/**
 * @interface Schedule
 * @property {string} id - The unique identifier for the schedule
 * @property {string} taskName - The name of the task
 * @property {Date} startDate - The start date of the task
 * @property {Date} endDate - The end date of the task
 * @property {string} engineerId - The ID of the engineer assigned to the task
 * @property {string} adminId - The ID of the admin who created the task
 * @property {string} customerId - The ID of the customer associated with the task
 * @property {string} productId - The ID of the product associated with the task
 * @property {string | null} location - The location of the task
 * @property {string | null} activity - The activity of the task
 * @property {string} adminName - The name of the admin who created the task
 * @property {string} engineerName - The name of the engineer assigned to the task
 * @property {string} [status] - The status of the task (ACCEPTED, REJECTED, RESCHEDULED, PENDING, CANCELED)
 * @property {Date} createdAt - The date and time when the task was created
 * @property {Date} updatedAt - The date and time when the task was last updated
 */
export interface Schedule {
  id: string;
  taskName: string;
  startDate: Date;
  endDate: Date;
  engineerId: string;
  adminId: string;
  customerId: string;
  productId?: string | null; 
  location: string | null;
  activity: string | null;
  adminName: string;
  engineerName: string;
  status?: "ACCEPTED" | "REJECTED" | "RESCHEDULED" | "PENDING" | "CANCELED" | "ONGOING" | "COMPLETED";
  // Accept, reject, pending, rescheduled, on going, done
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface CreateScheduleInput
 * @property {string} taskName - The name of the task
 * @property {Date} startDate - The start date of the task
 * @property {Date} endDate - The end date of the task
 * @property {string} engineerId - The ID of the engineer assigned to the task
 * @property {string} adminId - The ID of the admin who created the task
 * @property {string} customerId - The ID of the customer associated with the task
 * @property {string} productId - The ID of the product associated with the task
 * @property {string | null} location - The location of the task
 * @property {string | null} activity - The activity of the task
 */
export interface CreateScheduleInput {
  taskName: string;
  startDate: Date;
  endDate: Date;
  engineerId: string;
  adminId: string;
  customerId: string;
  productId?: string | null; 
  location: string | null;
  activity: string | null;
}
