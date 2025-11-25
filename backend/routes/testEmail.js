import express from "express";
import { sendWeeklyJobEmails } from "../services/emailService.js";
const router=express.Router();

router.get("/send-test", async (req,res) => {
  await sendWeeklyJobEmails();
  res.json({ message: "Test sent!" });
});
export default router;

