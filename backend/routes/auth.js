import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'

const prisma = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
const router = Router();

router.use((req, res, next) => {
  console.log("Incoming body:", req.body);
  next();
});


router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
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

export default router;
