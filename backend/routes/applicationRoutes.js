import express from "express";
import {PrismaClient} from "@prisma/client";
const router=express.Router();
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma; 
}

router.get("/candidate/:id", async (req, res) => {
  try {
    const {id}=req.params;
    const applications = await prisma.application.findMany({
      where: {candidateId:parseInt(id)},
      include: { job: true }, // include job info
      orderBy: { appliedAt: "desc" }
    });
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/job/:id", async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Fetch all applications for that job along with candidate details
    const applications = await prisma.application.findMany({
      where: {
        jobId: jobId,
      },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job" });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
});

router.get("/job/:id/applicants", async (req, res) => {
    try {
        const {id} = req.params;
        const applications = await prisma.application.findMany({
            where: {jobId: parseInt(id)},
            include: {candidate: true},
            orderBy: { updatedAt: "desc" }
        });
        res.json(applications);
    } catch (error) {
        console.error("Error fetching job applicants:", error);
        res.status(500).json({message: "Server error", error});
    }
});

router.post("/:status/:applicantId/:jobId", async (req,res)=>{
    
  try{
    const {status,applicantId,jobId}=req.params;
    const updatedApplication = await prisma.application.update({
      where: {
        candidateId_jobId: {
          candidateId: parseInt(applicantId),
          jobId: parseInt(jobId),
        },
      },
      data: { status },
    });
    res.json(updatedApplication);
  }
  catch(error){
    console.log("Error updation the status: "), error;
    res.status(500).json({message:"Server error", error})
  }
});

export default router;