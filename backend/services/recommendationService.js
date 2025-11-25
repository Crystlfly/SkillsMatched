import fetch from "node-fetch";
import { generateSystemToken } from "../utils/systemToken.js";

export async function getRecommendationsForUser(userId) {
  const res = await fetch(`${process.env.BACKEND_URL}/recommend`, {
    headers: { Authorization: `Bearer ${generateSystemToken(userId)}` } 
  });

  const data = await res.json();
  return data.recommendations || [];
}
