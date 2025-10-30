"use client";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/timeAgo";

interface CandidateProfileProps {
  isOpen: boolean;
  onCloseAction: () => void;
  applicant?: any;
  refreshApplicantsAction: () => void;
}

export default function CandidateProfile({
  isOpen,
  onCloseAction,
  applicant,
  refreshApplicantsAction,
}: CandidateProfileProps) {
  const [activeTab, setActiveTab] = useState("application");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  if (!isOpen || !applicant) return null;

  const { candidate, coverLetter, appliedAt, jobTitle } = applicant;

  const handleSubmit = async (status: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/${status}/${applicant.candidateId}/${applicant.jobId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        
        onCloseAction();
        refreshApplicantsAction();
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div className="bg-white rounded-xl shadow-lg w-[480px] max-h-[90vh] overflow-y-auto p-6 border border-gray-200">
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">Application Details</h2>
            <p className="text-gray-600 text-sm">
              Applying for: <strong>{jobTitle || "Unknown Role"}</strong>
            </p>
          </div>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-3">
          <h3 className="font-semibold text-lg">{candidate?.name}</h3>
          <p className="text-gray-500 text-sm">{candidate?.email}</p>
          <p className="text-gray-400 text-xs mt-1">Applied: {timeAgo(appliedAt)}</p>
        </div>

        {/* Tabs */}
        <div className="border-b mb-4 flex">
          {["application", "documents", "notes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-indigo-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "application" && (
          <div className="space-y-5">
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-gray-700 mb-2">Cover Letter</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {coverLetter || "No cover letter provided."}
              </p>
            </div>

            {applicant.linkedinUrl && (
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold text-gray-700 mb-2">Portfolio / LinkedIn</h4>
                <a
                  href={applicant.linkedinUrl}
                //   target="_blank"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {applicant.linkedinUrl}
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
            <div className="border rounded-lg p-3 text-sm text-gray-600">
                {applicant.resumeUrl ? (
                <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                >
                    View Resume
                </a>
                ) : (
                <p>No resume uploaded.</p>
                )}
            </div>
            )}


        {activeTab === "notes" && (
          <div className="border rounded-lg p-3 text-sm text-gray-600">
            <p>Add recruiter notes or remarks here.</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => handleSubmit("REJECTED")}
            className="px-3 py-2 rounded-md text-sm font-medium 
                      bg-red-200 text-red-600 hover:bg-red-300 
                      transition-colors duration-200"
          >
            Reject Applicant
          </button>
          {/* <button
            onClick={onCloseAction}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
          >
            Close
          </button> */}
          <button
            onClick={() => handleSubmit("INTERVIEW_SCHEDULED")}
            className="px-3 py-2 rounded-md text-sm font-medium 
                      bg-yellow-200 text-yellow-700 hover:bg-yellow-300 
                      transition-colors duration-200"
          >
            Schedule Interview
          </button>
          {/* <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 text-sm">
            Move to Next Round
          </button> */}
          <button
            onClick={() => handleSubmit("HIRED")}
            className="px-3 py-2 rounded-md text-sm font-medium 
                      bg-green-200 text-green-700 hover:bg-green-300 
                      transition-colors duration-200"
          >
            Select Applicant
          </button>
        </div>
      </div>
    </div>
  );
}
