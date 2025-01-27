import cron from "node-cron";
import { sendPendingReminders } from "../services/reminderService";

// Schedule the job to run every day at 12 PM = 5 ut
cron.schedule("0 12 * * *", async () => {
  console.log("Running reminder job...");
  await sendPendingReminders();
  console.log("Reminder job completed.");
});
