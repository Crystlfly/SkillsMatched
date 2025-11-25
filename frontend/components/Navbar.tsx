"use client";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useTheme } from "next-themes";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { PiSquaresFour } from "react-icons/pi";
import { TbUserQuestion } from "react-icons/tb";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileLogout from "./ProfileLogout";

interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

const navItems = [
  { name: "Dashboard", href: "/cDashboard" },
  { name: "Job Recommendations", href: "/job-recommendations" },
  { name: "My Applications", href: "/my-application" },
];

export default function Navbar() {
  const [user, setUser] = useState<MyJwtPayload | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Desktop dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Mobile sidebar visibility
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        setUser(decoded);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`, {
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
    return (
      parts[0][0].toUpperCase() +
      parts[parts.length - 1][0].toUpperCase()
    );
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="flex justify-between items-center border-b border-gray-300 bg-white dark:bg-gray-900 dark:border-white/20 px-5 md:px-20 py-3">
        
        {/* Hamburger - only mobile */}
        <button
          className="md:hidden text-3xl text-gray-900 dark:text-gray-200"
          onClick={() => setMenuOpen(true)}
        >
          <HiMenu />
        </button>

        {/* Logo */}
        <h1 className="text-xl font-bold text-black dark:text-white">
          SkillsMatched
        </h1>

        {/* Desktop Nav Items */}
        <ul className="hidden md:flex gap-6 text-gray-700 dark:text-gray-300">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`p-2 flex items-center hover:text-purple-600 hover:font-semibold ${
                pathname === item.href
                  ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/rDashboard"
            className="flex px-2 py-1 mt-2 mb-1 rounded-sm text-white text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-80 transition"
          >
            <PiSquaresFour className="mt-1 mr-1" />
            Employers
          </Link>
        </ul>


        {/* Right Side Icons */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
              className="px-2 py-1 text-gray-800 dark:text-gray-200"
            >
              {theme === "light" ? (
                <MdOutlineLightMode className="text-xl" />
              ) : (
                <MdOutlineDarkMode className="text-xl" />
              )}
            </button>
          )}

          {/* Profile (desktop only) */}
          <button
            className="hidden md:flex items-center gap-2 relative"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center">
              {profile?.name ? getInitials(profile.name) : <TbUserQuestion />}
            </div>
            <p className="font-semibold text-black dark:text-white">
              {profile?.name || "Guest"}
            </p>
          </button>
        </div>
      </nav>

      {/* Desktop dropdown */}
      {dropdownOpen && (
        <ProfileLogout
          mode="desktop"
          isOpen={dropdownOpen}
          onCloseAction={() => setDropdownOpen(false)}
          user={profile || { name: "Guest", email: "" }}
        />
      )}

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-bold text-black dark:text-white">
            Menu
          </h2>
          <button
            className="text-3xl text-gray-900 dark:text-gray-200"
            onClick={() => setMenuOpen(false)}
          >
            <HiX />
          </button>
        </div>

        {/* MENU LINKS */}
        <ul className="flex flex-col gap-2 px-5 mt-4 text-gray-800 dark:text-gray-300">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                pathname === item.href ? "text-purple-600 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/rDashboard"
            onClick={() => setMenuOpen(false)}
            className="flex px-2 py-2 mt-3 rounded text-white text-sm bg-gradient-to-r from-blue-500 to-purple-600"
          >
            <PiSquaresFour className="mr-2 text-lg" />
            Employers
          </Link>

          {/* MOBILE PROFILE INLINE */}
          <ProfileLogout
            mode="mobile"
            user={profile || { name: "Guest", email: "" }}
          />
        </ul>
      </div>
    </>
  );
}
