"use client"
import { useState, useEffect, use } from "react"
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useParams } from "next/navigation";
import { IoMailOutline } from "react-icons/io5";
import {timeAgo } from "@/lib/timeAgo";
import { IoIosCalendar } from "react-icons/io";
import Link from "next/link";
import CandidateProfile from "@/components/CandidateProfile"


interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}
export default function applicants(){
    const [open, setOpen] = useState(false);
    const params = useParams();
    const jobId = params.id;
    const [applicants, setApplicants] = useState<any[]>([]);
    const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
    const refreshApplications = async () => {
        try{
            const token = localStorage.getItem("token");
            if (!token) {
            window.location.href = "/login";
            return;
            }
            const decoded = jwtDecode<MyJwtPayload>(token);
            const res=await fetch("http://localhost:5000/applications/job/" + jobId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            const data=await res.json();
            setApplicants(data);
        }catch(err){
            console.error("Error refreshing applications: ", err);
        }
        
    };
    useEffect(() => {
        refreshApplications();
    },[]);

    return(
        <div className="bg-gray-100/50 min-h-screen dark:bg-gray-900">
            
            <div className="px-20 py-10">
                <Link href="/rDashboard">
      <button className="text-blue-600 text-[11px] ">← Back to Job Postings</button>
      </Link>
                <h1 className="font-bold text-2xl sm:text-3xl">Applicants</h1>
                    

                <div className="mt-6 space-y-4">
                 
                    {applicants.length > 0 ? (
                        applicants.map((applicant) => (
                        <div key={applicant.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center dark:bg-gray-800">
                            <div>
                                <h2 className="text-lg font-semibold">{applicant.candidate.name}</h2>
                                <div className="flex">
                                    <p className="flex text-sm text-gray-600 mr-3 dark:text-gray-300"><IoMailOutline className="my-1.5 mx-1"/>{applicant.candidate.email}</p>
                                    <p className="flex text-sm text-gray-600 dark:text-gray-300">• <IoIosCalendar className="my-1 mx-1"/>Applied: {timeAgo(applicant.appliedAt)}</p>
                                </div>
                                <h6
                                    className={`inline-block px-2 py-1 rounded text-sm ${
                                        applicant.status === "REJECTED"
                                        ? "bg-red-200/50 text-red-500"
                                        : applicant.status === "INTERVIEW_SCHEDULED"
                                        ? "bg-yellow-200 text-yellow-700"
                                        : applicant.status === "HIRED"
                                        ? "bg-green-200 text-green-700"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                                    >{applicant.status}</h6>
                            </div>
                            <div>
                                <div>
                                <button onClick={()=>(
                                    setSelectedApplicant(applicant),
                                    setOpen(true))}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mr-2">View Details</button>
                                </div>
                                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">Contacts</button>
                            </div>
                        </div>
                    ))
                ) : (
                <p className="text-gray-500 text-center mt-4">No applicants yet.</p>
                )}
                </div>

            </div>
            <CandidateProfile isOpen={open} onCloseAction={()=> setOpen(false)} 
            applicant={selectedApplicant}
            refreshApplicantsAction={refreshApplications}/>
            
        </div>
    )
}