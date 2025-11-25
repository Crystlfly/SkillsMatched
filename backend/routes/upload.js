import multer from 'multer';
import express from 'express';
import redis from '../redis.js';
import {supabaseAdmin} from "../lib/supabaseAdmin.js";
import {PrismaClient} from "@prisma/client";
import {authMiddleware} from "../middleware/auth.js";
import { getEmbedding } from '../bert_setup.js';

const prisma=globalThis.prisma || new PrismaClient();
const router=express.Router();
const storage=multer.memoryStorage();
const upload=multer({storage});
router.post("/upload",upload.single("resume"), async(req,res)=>{
    try{
        const file=req.file;
        const {candidateId, jobId, linkedinUrl, coverLetter, reason}=req.body;
        if(!file){
            return res.status(400).json({message:"No file uploaded"});
        }
        const safeFileName = file.originalname.replace(/[^\w.-]/g, "_");
        const filePath = `resume/${candidateId}_${Date.now()}_${safeFileName}`;
        const {data,error}=await supabaseAdmin.storage
        .from('resume').upload(filePath, file.buffer, {
            contentType:file.mimetype,
            upsert:true,
        })
        if(error) throw error;
        const {data:urlData}=supabaseAdmin.storage
        .from("resume")
        .getPublicUrl(filePath);

        const resumeUrl=urlData.publicUrl;
        
        const existingApplication = await prisma.application.findFirst({
            where: {
                candidateId:parseInt(candidateId),
                jobId:parseInt(jobId)
            }
        });
        if(existingApplication){
            console.log("Duplicate application detected for candidate:", candidateId);
            return res.status(400).json({message: "You have already applied to this job"});
        }
        const newApplication= await prisma.application.create({
            data:{
                candidateId:parseInt(candidateId),
                jobId: Number(jobId),
                linkedinUrl:linkedinUrl,
                coverLetter:coverLetter,
                reason:reason,
                resumeUrl:resumeUrl,
            },
        });

        res.status(200).json({
            "message":"Application submitted successfully",
            application:newApplication,
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Resume upload failed"})
    }
});

router.post("/jobRequirements", upload.single("resume"),authMiddleware,async(req,res)=>{
  try{
    const file=req.file;
    const candidateId=Number(req.user.userId);
    const{title, location, type}=req.body;
    const salary= Number(req.body.salary);
    const skills = JSON.parse(req.body.skills);

    if(!title || !location || !skills){
      return res.status(400).json({message:"Missing required fields"});
    }
    if(!file){
      return res.status(400).json({message:"No file uploaded"});
    }

    const userText=`
    Title: ${title}
    Location: ${location}
    Type: ${type}
    Salary: ${salary}
    Skills: ${skills.join(", ")}
    `;
    const embedding=await getEmbedding(userText);

    const safeFileName=file.originalname.replace(/[^\w.-]/g, "_");
    const filePath=`${candidateId}_${Date.now()}_${safeFileName}`;
    const {data,error}=await supabaseAdmin.storage
    .from('profileResume').upload(filePath, file.buffer, {
            contentType:file.mimetype,
            upsert:true,
        })
    if(error) throw error;
    const {data:urlData}=supabaseAdmin.storage
        .from("profileResume")
        .getPublicUrl(filePath);

    const resumeUrl=urlData.publicUrl; 
    const pref=await prisma.jobPreference.upsert({
      where:{candiId:candidateId},
      update: {
        title,
        location,
        type,
        salary,
        skills,
        resumeUrl,
        embedding,
      },
      create: {
        candiId: candidateId,
        title,
        location,
        type,
        salary,
        skills,
        resumeUrl,
        embedding,
      },
    });
    await redis.del(`recommendations:${candidateId}`);
    res.status(201).json({message:"Job preference created successfully", pref});
  }catch(error){
    console.error("Error creating job preference:", error);
    res.status(500).json({message:"Server error", error});
  }
});
export default router;