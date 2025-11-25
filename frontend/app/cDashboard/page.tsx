// app/candidate-dashboard/page.tsx
"use client";
import { Progress } from "@/components/ui/progress"; // if you have shadcn/ui
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { IoDocumentTextOutline, IoBookmarkOutline, IoTrendingUpSharp, IoCalendarOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { GoPerson } from "react-icons/go";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { timeAgo } from "@/lib/timeAgo";
import { BiSolidRightArrow } from "react-icons/bi";
import ProfileModal from "@/components/profileModal";


interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}




export default function CandidateDashboard() {
  const [user, setUser] = useState<MyJwtPayload | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>([])
  const [isOpen, setIsOpen]=useState(false);

  const router=useRouter();

  const getInitials = (fullName?: string) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = jwtDecode<MyJwtPayload>(token);
      setUser(decoded);

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data.user);
          console.log("Profile data:", data);
        });

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/candidate/${decoded.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res)=>res.json())
      .then((data)=>setApplications(data));

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res)=>res.json())
      .then((data)=>setStats(data));

    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  const iconData = [
    { title: "Applied Jobs", value: stats.applicationsCount, icon: IoDocumentTextOutline, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Offers Recieved", value: stats.offersCount, icon: IoTrendingUpSharp, color: "text-green-500", bgColor: "bg-green-100" },
    // { title: "Profile Views", value: 34, icon: IoTrendingUpSharp, color: "text-purple-500", bgColor: "bg-purple-100" },
    { title: "Interviews", value: stats.interviewsCount, icon: IoCalendarOutline, color: "text-red-500", bgColor: "bg-red-100" },
  ];


  function formatRole(role: string) {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  const handleViewMore=()=>{
    router.push(`/my-application`);

  }


  if (!user) return <p>Loading...</p>;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">

  <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 lg:px-20 py-6">
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
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 px-4 md:px-10 lg:px-20">
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
  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 md:px-10 lg:px-20 py-15">
    {/* Profile Overview */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300 w-full">
            <div className="flex items-center gap-2 mb-6">
            <GoPerson className="text-xl text-gray-700 dark:text-gray-100" />
            <h3 className="font-semibold text-lg">Profile Overview</h3>
            </div>

          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {getInitials(profile?.name)}
            </div>
            <div>
              <p className="font-semibold">{profile?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatRole(profile?.role)}</p>
              {/* <p className="text-xs text-gray-400">San Francisco, CA</p> */}
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {profile?.email && (
              <p><span className="font-semibold text-gray-800 dark:text-gray-100">Email:</span> {profile.email}</p>
            )}
            {profile?.phone && (
              <p><span className="font-semibold text-gray-800 dark:text-gray-100">Phone:</span> {profile.phone}</p>
            )}
            {profile?.location && (
              <p><span className="font-semibold text-gray-800 dark:text-gray-100">Location:</span> {profile.location}</p>
            )}
            {profile?.Bio && (
              <p><span className="font-semibold text-gray-800 dark:text-gray-100">Bio:</span> {profile.bio}</p>
            )}
          </div>

          {/* Social Links */}
          <div className="mt-4 space-y-1">
            {profile?.linkedIn_URL && (
              <a
                href={profile.linkedIn_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                LinkedIn Profile
              </a>
            )}
            {profile?.gitHub_URL && (
              <a
                href={profile.gitHub_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-700 dark:text-gray-200 hover:underline"
              >
                GitHub Profile
              </a>
            )}
            {profile?.portfolio_URL && (
              <a
                href={profile.portfolio_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-purple-600 hover:underline"
              >
                Portfolio
              </a>
            )}
          </div>

          {/* Edit Button */}
          <button 
            onClick={()=>setIsOpen(true)}
            className="mt-5 w-full rounded-md text-sm border border-gray-300 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:border-white/30 dark:hover:bg-gray-700 flex items-center justify-center gap-2 px-3 py-2">
            <FaRegEdit className="text-black dark:text-gray-100" />
            Edit Profile
          </button>
        </div>

    {/* Recent Activity */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300 w-full">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {applications.slice(0,3).map((application) => (
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
              <p className="text-xs text-gray-400 dark:text-gray-300 mt-2">Applied: {timeAgo(application.appliedAt)}</p>
            </div>
          </li>
        ))}
      </ul>
      <button
      onClick={handleViewMore}
      className="mt-4 inline-flex items-center gap-1 
        bg-gray-200/50 dark:bg-gray-700 
        text-gray-600 dark:text-gray-200 text-sm
        p-2 rounded-lg 
        hover:bg-gray-200 dark:hover:bg-gray-600 
        transition-colors duration-300"
    >
      View More
      <BiSolidRightArrow className="text-gray-500/70 dark:text-gray-200" />
    </button>
    </div>
  </section>
  <ProfileModal isOpen={isOpen} onCloseAction={()=> setIsOpen(false)}/>
</div>

  );
}
