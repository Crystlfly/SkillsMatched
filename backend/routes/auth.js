import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'
import { OAuth2Client } from "google-auth-library";
import { authMiddleware } from "../middleware/auth.js";

const prisma = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.use((req, res, next) => {
  console.log("Incoming body:", req.body);
  next();
});


router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "User creation failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);
  try {
    const start = Date.now();
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("email lookup:", Date.now() - start, "ms");
    if (!user) return res.status(404).json({ error: "User not found" });
    const pwStart  = Date.now();
    const valid = await bcrypt.compare(password, user.password);
    console.log("password lookup:", Date.now() - pwStart, "ms");
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/google", async (req,res)=>{
  try{
    const {token}=req.body;
    if(!token){
      return res.status(400).json({message:"Token Required"});
    }
    const userInfoRes = await fetch(
  `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const payload = await userInfoRes.json();
    if(!payload || !payload.email){
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    // CASE 1 — USER IS LOGGED IN → LINK GOOGLE
    if (req.user) {
      const userId = req.user.userId;

      // Check if this Google is already linked to someone else
      const existingGoogle = await prisma.user.findFirst({
        where: { googleId: payload.sub },
      });

      if (existingGoogle) {
        return res.status(400).json({
          message: "This Google account is already linked to another user",
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          googleId: payload.sub,
          profilePicUrl: payload.picture,
        },
      });

      return res.json({ message: "Google account linked successfully" });
    }

    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if(!user){
      user=await prisma.user.create({
        data:{
          name:payload.name,
          email: payload.email,
          googleId: payload.sub,
          profilePicUrl: payload.picture,
        },
      });
    }

    const accessToken=jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.json({ accessToken });
  }
  catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

export default router;
