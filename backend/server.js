// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
// import prisma from "./prisma.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeUpload from "./routes/upload.js";
import recommendationRoutes from "./routes/recommendation.js";
import testEmailRoute from "./routes/testEmail.js";
import "./cron/weeklyJobMailer.js";


const prisma = new PrismaClient();


dotenv.config({ path: ".env.local" });
const app = express();
// const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "SkillMatch Backend Running 🚀" });
});

// Example: fetch all users
app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);
app.use("/upload", resumeUpload);
app.use("/recommend",recommendationRoutes);
app.use("/test", testEmailRoute);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
