"use client";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useTheme } from "next-themes";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { PiSquaresFour } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";




interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

const navItems=[
  {name:"Dashboard", href:"/cDashboard"},
  {name:"Job Recommendations", href:"/job-recommendations"},
  {name:"My Applications", href:"/my-applications"},
]

export default function Navbar() {
  const [user, setUser] = useState<MyJwtPayload | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        setUser(decoded);

        const res = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  return (
    <nav className="flex justify-between items-center border-b border-gray-300 bg-white dark:bg-gray-900 dark:border-b dark:border-white/20 px-20 py-3 transition-colors duration-300">
      <h1 className="text-xl font-bold text-black dark:text-white">SkillsMatched</h1>

      <ul className="flex gap-3 text-gray-700 dark:text-gray-300">
        {navItems.map((item)=>(
          <Link
          key={item.name}
          href={item.href}
          className={`p-2 flex items-center hover:text-purple-600 hover:font-semibold mr-4 ${
              pathname === item.href
                ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                : ""
            }`}
            >
              {item.name}
            </Link>
        ))}      
        {/* <div>
        <button onClick={() => setOpen(true)}
          className="px-2 py-1 mt-2 rounded-sm text-white text-[12px] 
                    bg-gradient-to-r from-blue-500 to-purple-600  
                    hover:opacity-80 transition"
        >
          Post your job requirement
        </button>
        <PostJobModal isOpen={open} onCloseAction={() => setOpen(false)} />
        </div> */}
        <Link 
        href="/rDashboard"
        className=" flex px-2 py-1 mt-2 mb-1 rounded-sm text-white text-sm 
                    bg-gradient-to-r from-blue-500 to-purple-600  
                    hover:opacity-80 transition">
          <PiSquaresFour className="mt-1 mr-1"/>Employers
        </Link>


      </ul>

      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center">
          {profile?.name ? getInitials(profile.name) : "?"}
        </div>
        <p className="font-semibold text-black dark:text-white">
          {profile?.name || "Loading..."}
        </p>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="ml-2 px-2 py-1 text-gray-800 dark:text-gray-200 transition-colors duration-300"
          >
            {theme === "light" ? <MdOutlineLightMode className="text-xl"/> : <MdOutlineDarkMode className="text-xl"/>
}
          </button>
        )}
      </div>
    </nav>
  );
}
