import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";
import { getEmbedding } from '../bert_setup.js';

const router = express.Router();
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma; 
}

// POST /jobs -> recruiter posts a job
router.post("/", async (req, res) => {
  try {
    const { title, description, company, location, type, about, salary, skills, respnsblts, requirements, benefits, recruiterId } = req.body;

    if (!title || !description || !company || !location || !recruiterId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const jobText = `
      Title: ${title}
      Company: ${company}
      Location: ${location}
      Type: ${type}
      Salary: ${salary}
      Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
      Description: ${description}
      Responsibilities: ${respnsblts.join(", ")}
      Requirements: ${requirements.join(", ")}
      Benefits: ${benefits.join(", ")}
      About the Company: ${about}
    `;
    const embedding = await getEmbedding(jobText);

    const job = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        type,
        about,
        salary,
        skills,
        respnsblts,
        requirements,
        benefits,
        recruiterId,
        embedding:embedding,
      },
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/updateStatus", authMiddleware, async (req,res)=>{
  try{
    const {jobId,status}=req.body;
    const data=await prisma.job.update({
      where:{
        id:parseInt(jobId)
      },
      data:{jobStatus:status}
    });
    res.status(200).json({ message: "Job status updated successfully", data });
  }
  catch(error){
    res.status(500).json({message:"Error updating job status."})
  }
})


// GET /jobs/recruiter/:id -> fetch jobs posted by a recruiter
router.get("/recruiter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = await prisma.job.findMany({
      where: { recruiterId: parseInt(id) },
      orderBy: { createdAt: "desc" }
    });

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching recruiter jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /jobs/recruiter/:id -> fetch total applicants for jobs posted by a recruiter
router.get("/recruiter/:id/total-applicants", async (req, res) => {
  try {
    const recruiterId = parseInt(req.params.id);

    // Single optimized query using relation filters
    const totalApplicants = await prisma.application.count({
      where: {
        job: {
          recruiterId: recruiterId,
        },
      },
    });

    res.json({ totalApplicants });
  } catch (err) {
    console.error("Error fetching total applicants:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /jobs/search?title=...&company=...&location=...&skill=...&minSalary=...
router.get("/search", async (req, res) => {
  try {
    const { title, company, location, skill, minSalary } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          title ? { title: { contains: title, mode: "insensitive" } } : {},
          company ? { company: { contains: company, mode: "insensitive" } } : {},
          location ? { location: { contains: location, mode: "insensitive" } } : {},
          skill ? { skills: { has: skill } } : {},
          minSalary ? { salary: { gte: parseInt(minSalary) } } : {}
        ]
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobs);
  } catch (err) {
    console.error("Error searching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// GET /jobs -> fetch one jobs
router.get("/:id", async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { recruiter: true }
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /jobs -> fetch all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { recruiter: true }, // include recruiter info
      orderBy: { createdAt: "desc" }
    });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// PUT /jobs/:id -> update a job
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, company, location, salary, skills } = req.body;

    const updatedJob  = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { title, description, company, location, salary, skills }
    });

    res.status(201).json({ message: "Job updated successfully", updatedJob });
  } catch (err) {
    console.error("Error updating the job:", err);
    res.status(500).json({ message: "Server error" });
  }
})

// DELETE /jobs/:id -> delete a job
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({
      where: { id: parseInt(id) },
    });

    res.status(201).json({ message: "Job deleted successfully"});
  } catch (err) {
    console.error("Error deleting the job:", err);
    res.status(500).json({ message: "Server error" });
  }
})


export default router;
