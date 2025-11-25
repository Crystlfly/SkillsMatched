"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";
import { FiBriefcase } from "react-icons/fi";
import { FiCheckSquare } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { HiBriefcase } from "react-icons/hi2";
import CandidateJobPreference from "../../components/CandidateJobPreference";

interface Recommendation {
  score: number;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type?: string;
    skills?: { id: string; name: string }[];
  };
}

interface ResponseData {
  message: string;
  preferenceUsed: {
    title: string;
    location: string;
    type: string;
    salary: string;
    skills: string[];
  };
  recommendations: Recommendation[];
}

export default function RecommendedJobsPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResponseData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/recommend`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.message || "Failed to load recommendations");
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading recommendations...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        No recommendations found.
      </div>
    );

  const { preferenceUsed, recommendations } = data;

  return (
    <div className="min-h-screen bg-[#f5f7ff] dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="flex justify-between">
            <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Recommended Jobs
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Curated based on your saved preferences.
                </p>
            </div>
            <div>
                <button onClick={() => setOpen(true)}
                        className="px-6 py-2 mt-1 text-sm font-semibold 
                        bg-transparent rounded-md border border-gray-300 dark:border-gray-700/60 
                        text-transparent bg-clip-text 
                        bg-gradient-to-r from-blue-500 to-purple-500 
                        hover:shadow-[0_0_10px_rgba(99,102,241,0.4)] 
                        hover:scale-[1.03]
                        transition-all duration-300
                        dark:from-blue-400 dark:to-purple-400"
                    >
                    Post your job requirement
                </button>
                    <CandidateJobPreference isOpen={open} onCloseAction={() => setOpen(false)} />
            </div>
        </div>

        {/* ---- Preference Used ---- */}
        <div className="rounded-2xl border border-[#d9e2ff] dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow">
              <FiCheckSquare className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Preference Used
            </h2>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Title */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#f5f7ff] dark:bg-gray-700/50 border border-[#e2e8ff] dark:border-gray-700">
              <div className="h-8 w-8 rounded-lg bg-purple-200/70 dark:bg-purple-900 flex items-center justify-center">
                <HiBriefcase className="text-xl text-purple-700 dark:text-purple-400" />
              </div>

              <div className="flex flex-col break-words">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Title
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {preferenceUsed.title}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#f5f7ff] dark:bg-gray-700/50 border border-[#e2e8ff] dark:border-gray-700">
              <div className="h-8 w-8 rounded-lg bg-cyan-200/70 dark:bg-cyan-900 flex items-center justify-center">
                <GrLocation className="text-xl text-cyan-700 dark:text-cyan-400" />
              </div>

              <div className="flex flex-col break-words">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Location
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {preferenceUsed.location}
                </span>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#f5f7ff] dark:bg-gray-700/50 border border-[#e2e8ff] dark:border-gray-700">
              <div className="h-8 w-8 rounded-lg bg-orange-200/70 dark:bg-orange-900 flex items-center justify-center">
                <MdAccessTime className="text-xl text-orange-600 dark:text-orange-300" />
              </div>

              <div className="flex flex-col break-words">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Type
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {preferenceUsed.type}
                </span>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#f5f7ff] dark:bg-gray-700/50 border border-[#e2e8ff] dark:border-gray-700">
              <div className="h-8 w-8 rounded-lg bg-emerald-200/70 dark:bg-emerald-900 flex items-center justify-center">
                <MdAttachMoney className="text-xl text-emerald-700 dark:text-emerald-400" />
              </div>

              <div className="flex flex-col break-words">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Expected Salary
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {preferenceUsed.salary}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Showing {recommendations.length} recommended jobs
        </p>

        {/* Job Cards */}
        <div className="space-y-5">
          {recommendations.map((rec) => {
            const job = rec.job;

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e0e7ff] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-5"
              >
                {/* Top */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm">
                      <FiBriefcase className="text-xl" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                          {job.title}
                        </h3>

                        <p className="relative px-3 py-1 ml-2 mt-1 sm:mt-0 text-[11px] font-bold text-yellow-800 bg-yellow-300 rounded-md shadow-sm dark:bg-yellow-200 dark:text-yellow-900 before:absolute before:left-0 before:-bottom-1 before:w-full before:h-1 before:bg-yellow-500 before:rounded-b-md">
                          {(rec.score * 100).toFixed(0)}% Match
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {job.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mt-3">
                  <div className="flex items-center gap-1">
                    <CiLocationOn className="text-base" />
                    <span className="break-words">{job.location}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-medium">Salary:</span>
                    <span>₹{job.salary}</span>
                  </div>

                  {job.type && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Type:</span>
                      <span>{job.type}</span>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skills.slice(0, 4).map((skill: any, index: number) => (
                      <span
                        key={skill.id || index}
                        className="px-3 py-1 text-[11px] font-medium rounded-full bg-[#eef2ff] text-[#1d4ed8] border border-[#c7d2fe] dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700"
                      >
                        {typeof skill === "string" ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom actions */}
                <div className="mt-5 pt-4 border-t border-[#e5e7ff] dark:border-gray-700 flex flex-col sm:flex-row gap-3 items-stretch">
                  <Link href={`/job/${job.id}`} className="sm:flex-1">
                    <button className="w-full text-sm font-semibold py-2.5 px-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm transition">
                      Apply Now
                    </button>
                  </Link>

                  <Link href={`/job/${job.id}`}>
                    <button className="w-full sm:w-auto text-sm font-medium py-2.5 px-4 rounded-lg border border-[#d4ddff] dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-[#eef2ff] dark:hover:bg-gray-700 transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
