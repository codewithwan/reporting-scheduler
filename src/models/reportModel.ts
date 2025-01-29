/**
 * @interface Report
 * @property {string} id - The unique identifier for the report
 * @property {string} scheduleId - Schedule ID related to the report
 * @property {string} engineerId - Engineer ID who submitted the report
 * @property {string} customerId - Customer ID related to the report
 * @property {string} serviceId - Details of the service
 * @property {string} problem - The problem service
 * @property {date} processingTimeStart - Date when the service start
 * @property {date} processingTimeEnd - Date when the service end
 * @property {date} reportDate - Date when the report was submitted
 * @property {string} serviceStatus - Status for completing the service
 * @property {string} attachmentUrl - URL of the report attachment
 * @property {string} status - Report status
 * @property {date} createdAt - The date and time when the task was created
 * @property {date} updatedAt - The date and time when the task was updated
 */

export interface Report {
    id: string;
    scheduleId: string;
    engineerId: string;
    customerId: string;
    serviceIds: string[];
    problem: string;
    processingTimeStart: Date;
    processingTimeEnd: Date;
    reportDate: Date;
    serviceStatus: "FINISHED" | "UNFINISHED";
    attachmentUrl: string;
    status: "DRAFT" | "REVIEW" |"SIGNED";
    createdAt: Date;
    updatedAt: Date;
    categoryId: string,
    engineer_sign : string | null;
    customeer_sign : string | null;
}

/**
 * @interface CreateReportInput
 * @property {string} scheduleId - Schedule ID related to the report
 * @property {string} engineerId - Engineer ID who submitted the report
 * @property {string} customerId - Customer ID related to the report
 * @property {string} serviceId - Details of the service
 * @property {string} problem - The problem service
 * @property {date} processingTimeStart - Date when the service starts
 * @property {date} processingTimeEnd - Date when the service ends
 * @property {date} reportDate - Date when the report was submitted
 * @property {string} serviceStatus - Status for completing the service
 * @property {string} attachmentUrl - URL of the report attachment
 * @property {string} status - Report status
 */
export interface CreateReportInput {
    scheduleId: string;
    engineerId: string;
    customerId: string;
    serviceIds: string[];
    problem: string;
    processingTimeStart: Date;
    processingTimeEnd: Date;
    reportDate: Date;
    serviceStatus: "FINISHED" | "UNFINISHED";
    attachmentUrl: string;
    status: "DRAFT" | "REVIEW" |"SIGNED";
    categoryId: string,
    engineer_sign : string | null;
    customeer_sign : string | null;
}
