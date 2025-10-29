// app/candidate-dashboard/page.tsx
"use client";
import { Progress } from "@/components/ui/progress"; // if you have shadcn/ui
import { Badge } from "@/components/ui/badge";
import { IoDocumentTextOutline, IoBookmarkOutline, IoTrendingUpSharp, IoCalendarOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { GoPerson } from "react-icons/go";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { timeAgo } from "@/lib/timeAgo";


interface MyJwtPayload extends JwtPayload {
  userId: string;
  // email: string;
  role: string;
}




export default function CandidateDashboard() {
  const [user, setUser] = useState<MyJwtPayload | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = jwtDecode<MyJwtPayload>(token);
      setUser(decoded);

      fetch("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data.user);
          console.log("Profile data:", data);
        });

      fetch("http://localhost:5000/applications/candidate/" + decoded.userId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res)=>res.json())
      .then((data)=>setApplications(data));

    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  const iconData = [
    { title: "Applied Jobs", value: applications?.length, icon: IoDocumentTextOutline, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Saved Jobs", value: 8, icon: IoBookmarkOutline, color: "text-green-500", bgColor: "bg-green-100" },
    { title: "Profile Views", value: 34, icon: IoTrendingUpSharp, color: "text-purple-500", bgColor: "bg-purple-100" },
    { title: "Interviews", value: 3, icon: IoCalendarOutline, color: "text-red-500", bgColor: "bg-red-100" },
  ];


  function formatRole(role: string) {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }




  if (!user) return <p>Loading...</p>;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">

  <div className="flex justify-between items-center px-20 py-6">
    <section className="mt-6">
      <h2 className="text-2xl font-bold">Welcome back, {profile?.name}!</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Here’s what’s happening with your job search today
      </p>
    </section>

    <Link href="/jobs">
      <button className="px-4 py-2 flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <IoMdSearch className="text-white" />
        Find Jobs
      </button>
    </Link>
  </div>

  {/* Quick Stats */}
  <section className="grid grid-cols-4 gap-4 mt-6 px-20">
    {iconData.map((item, idx) => {
      const Icon = item.icon;
      return (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center transition-colors duration-300"
        >
          <div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-gray-500 dark:text-gray-400">{item.title}</p>
          </div>
          <div className={`w-12 h-12 flex justify-center items-center rounded-lg ${item.bgColor}`}>
            <Icon className={`${item.color} text-2xl`} />
          </div>
        </div>
      );
    })}
  </section>

  {/* Main Content */}
  <section className="grid grid-cols-2 gap-6 mt-6 px-20 py-15">
    {/* Profile Overview */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-6">
            <GoPerson className="text-xl text-gray-700 dark:text-gray-100" />
            <h3 className="font-semibold text-lg">Profile Overview</h3>
            </div>

          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">SJ</div>
            <div>
              <p className="font-semibold">{profile?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatRole(profile?.role)}</p>
              {/* <p className="text-xs text-gray-400">San Francisco, CA</p> */}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Profile Completion</p>
            <Progress value={85} className="mt-2 h-2 rounded-full" />
            </div>

          <div className="mt-4 flex gap-2">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">JavaScript</Badge>
            </div>
            
          <button className="mt-4 w-full rounded-md text-sm border border-gray-300 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:border-white/30 dark:hover:bg-gray-700 flex items-center justify-center gap-2 px-3 py-2">
  <FaRegEdit className="text-black dark:text-gray-100" />
  Edit Profile
</button>


        </div>

    {/* Recent Activity */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {applications.map((application) => (
          <li
            key={application.id}
            className="flex justify-between items-center bg-gray-100/50 dark:bg-gray-700/50 p-4 rounded-lg transition-colors duration-300"
          >
            <div>
              <p>{application.job.title}</p>
              <p className="text-gray-500 dark:text-gray-400">{application.job.company}</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded text-sm ${
                application.status==="REJECTED"
                ? "bg-red-200 text-red-600 dark:bg-red-300 dark:text-red-700"
                : application.status==="INTERVIEW_SCHEDULED"
                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-200 dark:text-yellow-700"
                : application.status==="HIRED"
                ? "bg-green-200 text-green-600 dark:bg-green-300 dark:text-green-700"
                : "bg-gray-200 text-gray-600 dark:bg-gray-200 dark:text-gray-700"
              }`}>
                {application.status}
              </span>
              <p className="text-xs text-gray-400 dark:text-gray-300">Applied: {timeAgo(application.appliedAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
</div>

  );
}
