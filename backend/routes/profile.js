import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma; 
}
const router = Router();

// GET /profile
router.get("/", authMiddleware, async (req, res) => {
    console.log("Profile route called, decoded user:", req.user);
  try {
    const userId = Number(req.user.userId); // safely cast

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID in token" });
    }
    const start = Date.now();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // expose only safe fields
        jobs: true, // include jobs if recruiter
      },
    });
    console.log("profile lookup:", Date.now() - start, "ms");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile route is working",
      user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
