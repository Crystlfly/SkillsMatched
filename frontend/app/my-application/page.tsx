"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Briefcase, Activity, CalendarCheck, Award  } from "lucide-react";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosCalendar } from "react-icons/io";
import { timeAgo } from "@/lib/timeAgo";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}


export default function MyApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
  async function loadApplications(){
    const token=localStorage.getItem("token");
    if (!token) {
      return <div className="text-center py-16">Please log in to view your applications.</div>;
    }
    const decoded=jwtDecode<MyJwtPayload>(token);
    try{
      const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/candidate/${decoded.userId}`);
      const data=await res.json();
      setApplications(data);
    }
    catch(error){
      console.error("Error fetching applications:", error);
    }
  }
  loadApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.job?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      app.job?.company?.toLowerCase().includes(searchText.toLowerCase()) ||
      app.job?.location?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8 px-4 sm:px-10 lg:px-20 transition-colors duration-300">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-2 text-center">My Applications</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 text-center">
        Track all your job applications in one place
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <Briefcase className="text-blue-500 dark:text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />, label: "Total Applications", value: applications.length },
          { icon: <Activity className="text-blue-500 dark:text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />, label: "Active", value: applications.filter(a => a.status !== "REJECTED").length },
          { icon: <CalendarCheck className="text-blue-500 dark:text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />, label: "Interviews", value: applications.filter(a => a.status === "INTERVIEW_SCHEDULED").length },
          { icon: <Award className="text-blue-500 dark:text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />, label: "Offers", value: applications.filter(a => a.status === "HIRED").length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center sm:flex-row sm:items-center gap-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-7 shadow-sm hover:shadow-md transition"
          >
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 rounded-lg flex items-center justify-center">
                {stat.icon}
            </div>
            <h2 className="text-3xl font-bold mb-1">{stat.value}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchText}
            onChange={(e)=>setSearchText(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
        value={statusFilter}
        onChange={(e)=>setStatusFilter(e.target.value)}
        className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>APPLIED</option>
          <option>INTERVIEW_SCHEDULED</option>
          <option>REJECTED</option>
          <option>OFFER RECIEVED</option>
        </select>
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {filteredApps.length > 0 ? (
          filteredApps.map((app: any) => (
            <div
              key={app.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-100/10 to-purple-100/50 dark:bg-gradient-to-br from-blue-600 to-purple-600 text-black dark:bg-blue-900 rounded-full font-semibold">
                    {app.job?.company?.charAt(0)|| ""}
                  </div>
                  <div>
                    <h3 className="font-semibold">{app.job?.title || "Job Title"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {app.job?.company || "Company Name"}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap gap-3">
                  <span className="flex">
                    <IoLocationOutline className="mx-auto text-gray-600 dark:text-gray-300 w-4.5 h-4.5 pr-1 ml-1" />
                    {app.job?.location || "Remote"}
                  </span>
                  <span className="flex">
                    <Briefcase className="mx-auto text-gray-600 dark:text-gray-300 w-4.5 h-4.5 pr-1 ml-1" />
                    {app.job?.type || "Full-time"}
                  </span>
                  <span className="flex">
                    <IoIosCalendar  className="mx-auto text-gray-600 dark:text-gray-300 w-4.5 h-4.5 pr-1 ml-1" />
                    Applied {timeAgo(new Date(app.appliedAt).toLocaleDateString())}
                    </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 sm:text-right text-left">
                <div
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full
                    ${
                      app.status === "REJECTED"
                        ? "bg-red-200 text-red-600 dark:bg-red-300 dark:text-red-700"
                        : app.status === "INTERVIEW_SCHEDULED"
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-200 dark:text-yellow-700"
                        : app.status === "HIRED"
                        ? "bg-green-200 text-green-600 dark:bg-green-300 dark:text-green-700"
                        : "bg-blue-200 text-blue-600 dark:bg-blue-200 dark:text-blue-700"
                    }`}
                >
                  {app.status}
                </div>
                <p className="mt-2 font-medium">{app.job?.salary || "N/A"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {app.job?.id || "—"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <Briefcase className="mx-auto text-gray-600 w-10 h-10 mb-3" />
            <p className="text-gray-400 text-sm">No applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
