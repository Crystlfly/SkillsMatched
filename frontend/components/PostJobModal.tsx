"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface MyJwtPayload extends JwtPayload {
userId: string;
role: string;
}

export default function PostJobModal({
    isOpen,
    onCloseAction,
    }: {
    isOpen: boolean;
    onCloseAction: () => void;
    }) {

  const [showSuccess, setShowSuccess] = useState(false);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResponsibilities, setNewResponsibilities] = useState("");

  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");

  const defaultFormState = {
    title: "",
    description: "",
    company: "",
    location: "",
    type: "FullTime",
    about: "",
    salary: "",
  };


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    type: "FullTime",
    about: "",
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

  const addResponsibility = () => {
    if (newResponsibilities.trim() && !responsibilities.includes(newResponsibilities.trim())) {
      setResponsibilities([...responsibilities, newResponsibilities.trim()]);
      setNewResponsibilities("");
    }
  };
  const removeResponsibility = (req: string) => setResponsibilities(responsibilities.filter(r => r !== req));


  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (req: string) => setRequirements(requirements.filter(r => r !== req));

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (ben: string) => setBenefits(benefits.filter(b => b !== ben));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(defaultFormState);
    setSkills([]);
    setNewSkill("");
    setResponsibilities([]);
    setNewResponsibilities("");
    setRequirements([]);
    setNewRequirement("");
    setBenefits([]);
    setNewBenefit("");
  };


  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem("token");
    if(!token){
      window.location.href="/login";
        return;
      }
    const decoded=jwtDecode<MyJwtPayload>(token);
    e.preventDefault();

    // convert comma-separated inputs into arrays
    const payload = {
      ...formData,
      salary: parseInt(formData.salary) || null,
      skills,
      respnsblts:responsibilities,
      requirements,
      benefits,
      recruiterId: decoded.userId, // hardcode for now, later get from logged-in user
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl p-6 relative dark:bg-gray-800">
        {/* Close button */}
            <button
            onClick={onCloseAction}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
                <X size={20} />
            </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-black/80 dark:text-white">Post a New Job</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title + Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-800 dark:text-white/90">Job Title*</label>
                <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full dark:bg-gray-700 dark:text-white/80"
                />
            </div>

            {/* Company */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-800 dark:text-white/90">Company*</label>
                <input
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. TechFlow Inc."
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full dark:bg-gray-700 dark:text-white/80"
                />
            </div>
            </div>


          {/* Location + Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
                <label className="font-medium text-gray-800 dark:text-white/90">Location*</label>
                <input type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA or Remote"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full dark:bg-gray-700 dark:text-white/80" />
            </div>
            <div className="flex flex-col">
                <label className="font-medium text-gray-800 dark:text-white/90">Job Type*</label>
                <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="bg-gray-200/50 text-black/50 rounded-lg px-4 py-2 w-full dark:bg-gray-700 dark:text-white/80">
                <option>Select</option>
                <option value="FullTime">Full-time</option>
                <option value="PartTime">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                </select>
            </div>
          </div>

          {/* Salary */}
            <label className="font-medium text-gray-800 dark:text-white/90">Salary*</label>
          <input type="text" 
            name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="e.g. $80000"
            className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full dark:bg-gray-700 dark:text-white/80" />

          {/* About Company */}
          <label className="font-medium text-gray-800 dark:text-white/90">About the company</label>
          <textarea 
            name="about"
          value={formData.about}
          onChange={handleChange}
          placeholder="Describe the company, culture, and what makes it a great place to work..."
            rows={3}
            className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full dark:bg-gray-700 dark:text-white/80" />

          {/* Role description */}
          <label className="font-medium text-gray-800 dark:text-white/90">Role Description</label>
          <textarea 
            name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the role, responsibilities, and what you're looking for..."
            rows={3}
            className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full dark:bg-gray-700 dark:text-white/80" />

          {/* Skills input */}
          <div>
            <label className="font-medium text-gray-800 dark:text-white/90">Skills Required</label>
            <div className="flex items-center gap-2 mt-2">
              <input
              name="skills"
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 flex-grow dark:bg-gray-700 dark:text-white/80"
              />
              <button
                type="button"
                onClick={addSkill}
                className="border text-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:text-white/90 dark:hover:bg-gray-700"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Skills list */}
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm flex items-center gap-1 dark:text-white/90 dark:bg-gray-700"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-gray-800 hover:text-red-500 dark:text-white/90">×</button>
                </span>
              ))}
            </div>
          </div>

          {/*Responsibilities*/}
          <label className="font-medium text-gray-800 text-base dark:text-white/90">Responsibilities</label>
          <div className="flex items-center gap-2 mt-2">
            <input
                type="text"
                value={newResponsibilities}
                onChange={(e) => setNewResponsibilities(e.target.value)}
                placeholder="Add a responsibility"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 flex-grow dark:bg-gray-700 dark:text-white/80"
            />
            <button
                type="button"
                onClick={addResponsibility}
                className="border text-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:text-white/90 dark:hover:bg-gray-700"
            >
                <Plus size={20} />
            </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
            {responsibilities.map((req, idx) => (
                <span
                key={idx}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm flex items-center gap-1 dark:text-white/90 dark:bg-gray-700"
                >
                {req}
                <button onClick={() => removeResponsibility(req)} className="text-gray-800 hover:text-red-500 dark:text-white/90">×</button>
                </span>
            ))}
            </div>


          {/* Requirements */}
          <label className="font-medium text-gray-800 dark:text-white/90">Requirements</label>
          <div className="flex items-center gap-2 mt-2">
            <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 flex-grow dark:bg-gray-700 dark:text-white/80"
            />
            <button
                type="button"
                onClick={addRequirement}
                className="border text-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:text-white/90 dark:hover:bg-gray-700"
            >
                <Plus size={20} />
            </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
            {requirements.map((req, idx) => (
                <span
                key={idx}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm flex items-center gap-1 dark:text-white/90 dark:bg-gray-700"
                >
                {req}
                <button onClick={() => removeRequirement(req)} className="text-gray-800 hover:text-red-500 dark:text-white/90">×</button>
                </span>
            ))}
            </div>

          {/* Benefits */}
            <label className="font-medium text-gray-800 dark:text-white/90">Benefits</label>
            <div className="flex items-center gap-2 mt-2">
            <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 flex-grow dark:bg-gray-700 dark:text-white/80"
            />
            <button
                type="button"
                onClick={addBenefit}
                className="border text-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:text-white/90 dark:hover:bg-gray-700"
            >
                <Plus size={20} />
            </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
            {benefits.map((ben, idx) => (
                <span
                key={idx}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm flex items-center gap-1 dark:text-white/90 dark:bg-gray-700"
                >
                {ben}
                <button onClick={() => removeBenefit(ben)} className="text-gray-800 hover:text-red-500 dark:text-white/90">×</button>
                </span>
            ))}
            </div>

          {/* Submit */}
          <div className="display flex gap-4">
          <button type="submit"
            className="flex-[4] bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-0.5 rounded-lg hover:opacity-90 transition">
            Post Job
          </button>
          <button type="button" onClick={onCloseAction}
            className="flex-[1] bg-white text-black border border-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-200 transition dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
            Cancel
          </button>
          </div>
        </form>
      </div>
      {showSuccess && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white/80">Job Posted!</h2>
      <p className="mb-6 test-gray-800 dark:text-white/70">Your job has been successfully posted.</p>
      <button
        onClick={() => {
          resetForm();
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
