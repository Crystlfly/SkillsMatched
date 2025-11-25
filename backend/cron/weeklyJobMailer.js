import cron from "node-cron";
import { sendWeeklyJobEmails } from "../services/emailService.js";

cron.schedule("0 9 * * 1", async () => {
  console.log("Running weekly job recommendation job...");
  await sendWeeklyJobEmails();
});
