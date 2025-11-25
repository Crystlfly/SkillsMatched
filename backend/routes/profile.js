import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import multer from 'multer';

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma; 
}
const router = Router();
const storage=multer.memoryStorage();
const upload=multer({storage});

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
        phone: true,
        location: true,
        bio:true,
        linkedIn_URL:true,
        gitHub_URL:true,
        portfolio_URL:true,
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

router.get("/stats", authMiddleware, async(req, res)=>{
  try{
    const userId = Number(req.user.userId); // safely cast
    const response=await fetch(`${process.env.BACKEND_URL}/applications/candidate/${userId}`);
    const applications=await response.json();
    const accepted=applications.filter(app => app.status === "HIRED");
    const interviews=applications.filter(app => app.status === "INTERVIEW_SCHEDULED");
    res.json({applicationsCount: applications.length, interviewsCount: interviews.length, offersCount: accepted.length});
  }
  catch(error){
    console.error("Profile stats fetch error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/uploadProfile", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const userId = Number(req.user.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID in token" });
    }

    const file = req.file;
    const { name, email, phone, location, Bio, linkedIn_URL, gitHub_URL, portfolio_URL } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const safeFileName = file.originalname.replace(/[^\w.-]/g, "_");
    const filePath = `profile-pictures/${userId}_${Date.now()}_${safeFileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("profile")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return res.status(500).json({ message: "Failed to upload image" });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("profile")
      .getPublicUrl(filePath);

    const profilePicUrl = urlData.publicUrl;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        location,
        bio:Bio,
        linkedIn_URL,
        gitHub_URL,
        portfolio_URL,
        profilePicUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        bio: true,
        linkedIn_URL: true,
        gitHub_URL: true,
        portfolio_URL: true,
        profilePicUrl: true,
      },
    });

    res.json({
      message: "Profile updated successfully!",
      user: updatedUser,
    });

  }catch(error){
    console.log("Error updating profile: ",error);
    res.status(500).json({message: "Server Error", error});
  }
});

export default router;
