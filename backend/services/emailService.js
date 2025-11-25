import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { getRecommendationsForUser } from "./recommendationService.js";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendWeeklyJobEmails() {
  const users = await prisma.user.findMany({
    where: { role: "CANDIDATE" },
    select: { id: true, email: true, name: true }
  });

  for (const user of users) {
    const recommendations = await getRecommendationsForUser(user.id);
    if (!recommendations.length) continue;

    const jobsHtml = recommendations.map(rec => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${rec.job.title}</strong> at ${rec.job.company}<br/>
          ${rec.job.location} — ₹${rec.job.salary}<br/>
          <small>Match Score: ${(rec.score * 100).toFixed(1)}%</small>
        </td>
      </tr>
    `).join("");

    await transporter.sendMail({
      to: user.email,
      subject: "Your Weekly Job Recommendations 🔍",
      html: `
        <h2>Hi ${user.name},</h2>
        <p>Here are your top-matched jobs this week:</p>
        
        <table style="width: 100%; font-size: 14px;">
          ${jobsHtml}
        </table>

        <br/>
        <p>Visit your dashboard to apply for these jobs:</p>
        <a href="${process.env.FRONTEND_URL}/job-recommendations" 
           style="background-color:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:4px;">
           View Recommendations
        </a>
      `
    });
  }
}
