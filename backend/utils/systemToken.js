import jwt from "jsonwebtoken";

export function generateSystemToken(userId) {
  return jwt.sign(
    {
      userId,
      role: "CANDIDATE"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}
