"use client";
import { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import Link from "next/link";
import PostJobModal from "@/components/PostJobModal";

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  type?: string; // e.g., Full-time
  mode?: string; // e.g., Remote
  skills?: { id: string; name: string }[];
}

export default function JobsPage() {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [results, setResults] = useState<Job[]>([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const handleSearch = async () => {
    const query = new URLSearchParams();
    if (title) query.append("title", title);
    if (company) query.append("company", company);
    if (location) query.append("location", location);
    if (minSalary) query.append("minSalary", minSalary);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/search?${query.toString()}`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`);
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }
    loadJobs();
  }, []);

  const displayJobs = results.length > 0 ? results : jobs;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 p-6 bg-white dark:bg-gray-900">
        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <input
          placeholder="Min Salary"
          type="number"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
          className="px-3 py-2 border rounded-md w-32 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Search
        </button>
        <div>
          <button onClick={() => setOpen(true)}
            className="px-2 py-1 mt-2 rounded-sm text-white text-[12px] 
                      bg-gradient-to-r from-blue-500 to-purple-600  
                      hover:opacity-80 transition"
          >
          Post your job requirement
          </button>
          <PostJobModal isOpen={open} onCloseAction={() => setOpen(false)} />
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto mt-8 ml-6 mr-6">
        <h1 className="text-sm font-semibold mb-8 text-gray-500 dark:text-white/50">
          Showing {displayJobs.length} of {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
        </h1>

        {displayJobs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {displayJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl bg-white dark:bg-gray-800 p-6 flex flex-col h-full 
             border border-gray-200 dark:border-gray-700 group transition transform hover:-translate-y-1 
             hover:shadow-[0_0_20px_rgba(59,130,246,0.4),0_0_30px_rgba(139,92,246,0.4)]"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition dark:group-hover:text-blue-600">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.company}
                      </p>
                    </div>
                    {/* Placeholder for company logo */}
                   <div className="mb-5 dark:bg-gray-700 flex items-center justify-center text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                    ${job.salary}
                  </div>

                </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4 mt-4">
                    <span className="px-3 py-1 text-[10px] font-medium bg-gray-100/60 text-blue-700 rounded-full dark:bg-gray-700/50 dark:text-blue-400">
                     <CiLocationOn className="inline mr-1 mb-0.5 text-base" />

                      {job.location}
                    </span>

                    {/* <span className="px-3 py-1 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">
                      {job.salary}
                    </span> */}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow line-clamp-3">
                    {job.description}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skills &&
                      job.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-sm border border-blue-500"
                        >
                          {typeof skill === "string" ? skill : skill.name}
                        </span>
                      ))}


                    {/* <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                      {job.mode || "Remote"}
                    </span> */}
                  </div>


                  {/* Apply Button */}
                  <Link href={`/job/${job.id}`}>
                  <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90" >
                    Apply Now →
                  </button>
                  </Link>
                </div>
              </div>


            ))}
          </div>
        )}
      </div>
    </div>
  );
}
