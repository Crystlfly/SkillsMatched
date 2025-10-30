"use client";
import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {supabase} from "@/lib/supabaseClient";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { TiWarning } from "react-icons/ti";

interface MyJwtPayload extends JwtPayload {
  userId: string;
  // email: string;
  role: string;
}


export default function ApplicationModal({ isOpen, onCloseAction, jobId, jobTitle }: { 
  isOpen: boolean; 
  onCloseAction: () => void; 
  jobId: number | string;
  jobTitle: string; 
}) {
  if (!isOpen) return null; // don't render if closed

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(!token){
      window.location.href="/login"
      return;
    }
    try{
      const decoded=jwtDecode<MyJwtPayload>(token);
      setCandId(decoded.userId);
    }catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

  },[]);

  const [file, setFile]=useState<File| null>(null);
  const [uploading, setUploading]=useState(false);
  const [candId, setCandId]=useState<string |null>(null);
  const [linkedinUrl, setLinkedinUrl]=useState("");
  const [coverLetter, setCoverLetter]=useState("");
  const [reason, setReason]=useState("");
  const [errorMsg, setErrorMsg]=useState<string | null>(null);

  const handleSubmit=async()=>{
    if (!file || !candId){
      setErrorMsg("Resume not uploaded or user logged out");
      document.querySelector("#error-message")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setUploading(true);
    try{
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("candidateId", candId); 
      formData.append("jobId",jobId.toString());
      formData.append("linkedinUrl", linkedinUrl);
      formData.append("coverLetter", coverLetter);
      formData.append("reason", reason);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/upload`, {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      console.log("Application Submitted successful:", data);
      alert("Application Submitted successfully!");
      console.log("Resume URL:", data.url);
    }
    catch(err:any){
      console.error("Error uploading the file", err.message);
       setErrorMsg(err.message);
       document.querySelector("#error-message")?.scrollIntoView({ behavior: "smooth" });
    }finally{
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] max-h-[90vh] flex flex-col shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="border-b border-b-gray-900 dark:border-gray-700 px-6 py-4 ">
          <h2 className="text-xl font-bold">Apply for {jobTitle}</h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div
              id="error-message"
              className=" flex mb-4 text-sm font-semibold text-red-700 bg-red-100 border border-red-300 rounded-lg p-3 shadow-sm"
            >
              <TiWarning className="mt-1 mr-1"/> {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-medium mb-1 text-sm">Portfolio or LinkedIn URL *</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full border p-2 rounded mb-4 placeholder:text-[12px]"
              />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm">Resume *</label>
            <label className="border border-dashed border-gray-400 p-4 rounded mb-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50">
              <Plus className="mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOCX. Max size: 5MB</p>
              <input
                id="resume"
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];

                    // Basic size validation (5MB = 5 * 1024 * 1024)
                    if (file.size > 5 * 1024 * 1024) {
                      <p className="text-red">The file size is greater than 5MB</p>
                      e.target.value = ""; // reset input
                      return;
                    }

                    setFile(file);
                    console.log("FIle ready to upload", file.name);
                  }
                }}
              />
            </label>
          </div>
          <label className="block font-medium mb-1 text-sm">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e)=> setCoverLetter(e.target.value)}
            placeholder="Write a brief cover letter to introduce yourself..."
            className="w-full border p-2 rounded mb-4 placeholder:text-[12px]"
          />
          <label className="block font-medium mb-1 text-sm">
            Why are you interested in this position?
          </label>
          <textarea
            value={reason}
            onChange={(e)=> setReason(e.target.value)}
            placeholder="Tell us why you're excited about this role and what makes you a great fit..."
            className="w-full border p-2 rounded mb-4 placeholder:text-[12px]"
          />
          <div className="mb-4 border">
            <p className="p-2 text-[10px] flex items-center justify-between text-gray-600">
              By submitting this application, you agree to our Terms of Service and Privacy Policy. We'll
only use your information for recruitment purposes.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCloseAction}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 text-white"
              disabled={uploading}
              onClick={handleSubmit}
            >
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

