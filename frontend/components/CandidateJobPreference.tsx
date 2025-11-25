"use client";
import { useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { X, Plus } from "lucide-react";

interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

export default function CandidateJobPreference({
  isOpen,
  onCloseAction,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
}) {
  const [file, setFile]=useState<File| null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "FullTime",
    salary: "",
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }

  if (!file) {
    alert("Please upload a resume before submitting!");
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("title", formData.title);
  formDataToSend.append("location", formData.location);
  formDataToSend.append("type", formData.type);
  formDataToSend.append("salary", formData.salary);
  formDataToSend.append("skills", JSON.stringify(skills));
  formDataToSend.append("resume", file);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/jobRequirements`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    if (res.ok) {
      setShowSuccess(true);
    } else {
      const error = await res.json();
      alert("Error: " + error.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onCloseAction}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
          Post Your Job Preference
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <div>
            <label className="block font-medium mb-1 text-gray-800 dark:text-white/90">
              Job Title*
            </label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white/80 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Location + Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-800 dark:text-white/90">
                Location*
              </label>
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote or San Francisco, CA"
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white/80 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-800 dark:text-white/90">
                Job Type*
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white/80 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="FullTime">Full-time</option>
                <option value="PartTime">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block font-medium mb-1 text-gray-800 dark:text-white/90">
              Salary (per annum)
            </label>
            <input
              name="salary"
              type="text"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 80000"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white/80 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-medium mb-1 text-gray-800 dark:text-white/90">
              Skills
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-grow bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white/80 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={addSkill}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Plus size={20} />
              </button>
            </div>
            {/* Skills List */}
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Resume Upload */}
          <div>
            <label className="border border-dashed border-gray-400 p-4 rounded mb-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
              <Plus className="mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Supported formats: PDF, DOCX. Max size: 5MB</p>
              <input
                id="resume"
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];

                    // Basic size validation (5MB = 5 * 1024 * 1024)
                    if (file.size > 5 * 1024 * 1024) {
                      <p className="text-red">The file size is greater than 5MB</p>
                      e.target.value = ""; // reset input
                      return;
                    }

                    setFile(file);
                    console.log("FIle ready to upload", file.name);
                  }
                }}
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
            >
              Post Preference
            </button>
            <button
              type="button"
              onClick={onCloseAction}
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-80 text-center animate-fadeIn">
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              Job Preference Posted!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-5">
              Your job preference has been successfully posted.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                onCloseAction();
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
