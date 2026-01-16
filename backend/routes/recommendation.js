import redis from "../redis.js";
import {authMiddleware} from "../middleware/auth.js";
import {PrismaClient} from "@prisma/client";
import express from "express";
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma; 
}

const router=express.Router();


function cosSimilarity(a,b){
    let dot=0, magA=0, magB=0;
    for(let i=0;i<a.length;i++){
        dot+=a[i]*b[i];
        magA+=a[i]*a[i];
        magB+=b[i]*b[i];

    }
    return dot/(Math.sqrt(magA)*Math.sqrt(magB));
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.user.userId);

    const cached= await redis.get(`recommendations:${userId}`);
    if(cached){
        console.log("recommendations from cache", userId);
        return res.json(JSON.parse(cached));
    }

    const pref = await prisma.jobPreference.findUnique({
      where: { candiId: userId },
      select: {
        embedding: true,
        title: true,
        location: true,
        type: true,
        salary: true,
        skills: true,
      },
    });

    if (!pref || !pref.embedding || pref.embedding.length === 0) {
      return res
        .status(400)
        .json({ message: "Job preference or its embedding not found" });
    }

    const jobs = await prisma.job.findMany({
      where: { jobStatus: "ACTIVE" },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        skills: true,
        embedding: true,
      },
    });

    const filteredJobs = jobs.filter(
      (job) => job.embedding && job.embedding.length > 0
    );

    const results = filteredJobs.map((job) => ({
      job,
      score: cosSimilarity(pref.embedding, job.embedding),
    }));

    results.sort((a, b) => b.score - a.score);

    const responseData ={
      message: "Recommended jobs fetched successfully",
      preferenceUsed: {
        title: pref.title,
        location: pref.location,
        type: pref.type,
        salary: pref.salary,
        skills: pref.skills,
      },
      recommendations: results.slice(0, 10),
    };
    await redis.set(`recommendations:${userId}`, JSON.stringify(responseData), "EX",3600);
    return res.json(responseData);

  } catch (error) {
    console.error("Error recommending jobs:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
export default router;