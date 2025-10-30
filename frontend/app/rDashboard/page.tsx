"use client"
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { MdPeopleAlt } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import Link from "next/link";
import PostJobModal from "@/components/PostJobModal";
import { Plus } from "lucide-react";
import ViewJobModal from "@/components/viewJobModal";

interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

export default function RecuiterDashboard() {
  const [open, setOpen] = useState(false);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [applicantCounts, setApplicantCounts] = useState<{ [key: string]: number }>({});
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [openJobModal, setOpenJobModal] = useState(false);

  // const [jobId, setJobId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const decoded = jwtDecode<MyJwtPayload>(token);

    // Fetch all jobs for this recruiter
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/recruiter/${decoded.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(async (jobs) => {
        setJobPostings(jobs);

        const counts: { [key: string]: number } = {};

        for (const job of jobs) {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/job/${job.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const data = await res.json();

            counts[job.id] = Array.isArray(data) ? data.length : 0;
          } catch (err) {
            console.error("Error fetching applicants for job", job.id, err);
            counts[job.id] = 0;
          }
        }

        setApplicantCounts(counts);
      })
      .catch((err) => console.log("Error fetching jobs:", err));
  }, []);


  return (
    <div className="bg-gray-100/50 min-h-screen dark:bg-gray-900 transition-colors duration-300">
      <div className="px-5 sm:px-10 md:px-20 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-gray-900 dark:text-gray-100">Employer Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Manage your job postings and view applicants
          </p>
          </div>
          <div>
                        <button onClick={() => setOpen(true)}
                        className="px-2 py-2 flex mt-2 rounded-sm text-white text-sm
                                    bg-gradient-to-r from-blue-500 to-purple-600  
                                    hover:opacity-80 transition"
                        >
                            <Plus className="py-1"/>
                        Post a Job
                        </button>
                        <PostJobModal isOpen={open} onCloseAction={() => setOpen(false)} />
          </div>

        </div>


        <h2 className="pt-10 font-semibold text-lg sm:text-xl text-gray-900 dark:text-gray-100">Your Job Postings</h2>

        <div>
          {jobPostings?.map((job) => (
            <div
              key={job.id}
              className="flex flex-col lg:flex-row justify-between m-5
                           bg-white dark:bg-gray-800 
                           border border-gray-200 dark:border-gray-700 rounded-md p-4 
                           hover:shadow-xl dark:hover:shadow-gray-700/30 transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{job.title}</h3>

                <div className="flex flex-wrap gap-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <h6>{job.location}</h6>
                  <h6>• {job.type}</h6>
                  <h6>• ${job.salary}</h6>
                </div>

                <div className="mt-2 flex flex-wrap">
                  {job.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm px-2 py-1 rounded-md mr-2 mt-2 font-semibold text-[12px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-10 md:gap-20 border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                  <div>
                    <h6 className="text-gray-700 dark:text-gray-400 mt-2 text-sm">Total Applicants</h6>
                    <h5 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{applicantCounts[job.id] || 0}</h5>
                  </div>
                  <div>
                    <h6 className="text-gray-700 dark:text-gray-400 mt-2 text-sm">Total Applicants</h6>
                    <h5 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{applicantCounts[job.id] || 0}</h5>
                  </div>
                  <div>
                    <h6 className="text-gray-700 dark:text-gray-400 mt-2 text-sm">Total Applicants</h6>
                    <h5 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{applicantCounts[job.id] || 0}</h5>
                  </div>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col gap-2 justify-center mt-4 lg:mt-0 lg:ml-4">
                <Link href={`/applicant/${job.id}`}>
                <button className="flex items-center justify-center 
                                    bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                                    px-4 py-2 rounded-md hover:opacity-70 
                                    transition text-sm sm:text-base">
                  <MdPeopleAlt className="mr-2" /> View Applicants
                </button>
                </Link>
                <button 
                onClick={()=>{
                  console.log("Opening modal for job:", job.id);
                  setSelectedJobId(job.id);
                  setOpenJobModal(true);
                }}
                className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-black dark:text-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 
                                     transition text-sm sm:text-base">
                  <FiEye className="mr-2" /> View Job Post
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ViewJobModal isOpen={openJobModal} onCloseAction={()=>setOpenJobModal(false)} 
      job={selectedJobId}/>
    </div>
  );
}
