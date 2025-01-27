/**
 * @interface RescheduleRequest
 * @property {string} id - The unique identifier for the reschedule request
 * @property {string} scheduleId - The ID of the associated schedule
 * @property {string} requestedBy - The ID of the user who requested the reschedule
 * @property {string} reason - The reason for the reschedule request
 * @property {Date} newDate - The new date and time for the schedule
 * @property {string} status - The status of the reschedule request (PENDING, APPROVED, REJECTED)
 * @property {Date} createdAt - The date and time when the reschedule request was created
 * @property {Date} updatedAt - The date and time when the reschedule request was last updated
 */
export interface RescheduleRequest {
  id: string;
  scheduleId: string;
  requestedBy: string;
  reason: string;
  newDate: Date;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface CreateRescheduleRequestInput
 * @property {string} scheduleId - The ID of the associated schedule
 * @property {string} requestedBy - The ID of the user who requested the reschedule
 * @property {string} reason - The reason for the reschedule request
 * @property {Date} newDate - The new date and time for the schedule
 */
export interface CreateRescheduleRequestInput {
  scheduleId: string;
  requestedBy: string;
  reason: string;
  newDate: Date;
}
