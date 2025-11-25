"use client";
import {useState} from "react"
import { X, Upload  } from "lucide-react";

export default function ProfileModal({
  isOpen,
  onCloseAction,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
}) {
    const [formData, setFormData]=useState({
        name:"",
        email:"",
        phone:"",
        location:"",
        Bio:"",
        linkedIn_URL:"",
        gitHub_URL:"",
        portfolio_URL:"",

    })
      const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    try {
      const formPayload = new FormData();
      for (const key in formData) {
        formPayload.append(key, (formData as any)[key]);
      }

      // Append image file if selected
      const fileInput = document.getElementById("profileImage") as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formPayload.append("profileImage", fileInput.files[0]);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/uploadProfile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT add Content-Type manually for FormData
        },
        body: formPayload,
      });

      if (!res.ok) {
        console.error("Failed to save profile:", res.statusText);
      } else {
        const data = await res.json();
        alert("Profile saved");
        console.log("Profile saved successfully:", data);
        onCloseAction(); // Close modal after save
      }
    } catch (err) {
      console.error("Error saving profile", err);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-11/12 max-w-lg relative max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onCloseAction}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Update your profile information to improve your job matches
          </p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24">
            <img
            src={
                profileImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png" // default avatar
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
            />
            <label
            htmlFor="profileImage"
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full cursor-pointer"
            >
            <Upload size={16} />
            </label>
            <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Upload your profile picture
        </p>
        </div>


        {/* Form Fields */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-800 dark:text-white/90 mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Name"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white/80"
              />
            </div>
            <div>
              <label className="font-medium text-gray-800 dark:text-white/90 mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white/80"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-800 dark:text-white/90 mb-1 block">
                Phone
              </label>
              <input
                type="number"
                value={formData.phone}
                onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Optional"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white/80"
              />
            </div>
            <div>
              <label className="font-medium text-gray-800 dark:text-white/90 mb-1 block">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, Country"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white/80"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="font-medium text-gray-800 dark:text-white/90 mb-1 block">
              Bio
            </label>
            <textarea
                value={formData.Bio}
                onChange={(e) =>
                    setFormData({ ...formData, Bio: e.target.value })
                }
                placeholder="Optional"
                rows={3}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto"; // reset height
                    target.style.height = `${target.scrollHeight}px`; // set to new height
                }}
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white/80 transition-all max-h-40 overflow-y-auto"
            ></textarea>

          </div>

          {/* URLs */}
          <div className="space-y-4">
            {/* LinkedIn */}
            <div>
                <label className="font-medium text-gray-800 dark:text-white/90 mb-1 block">
                LinkedIn URL
                </label>
                <input
                type="text"
                value={formData.linkedIn_URL}
                onChange={(e) =>
                    setFormData({ ...formData, linkedIn_URL: e.target.value })
                }
                placeholder="https://linkedin.com/in/your-profile"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                dark:bg-gray-700 dark:text-white/80"
                />
            </div>

            {/* GitHub */}
            <div>
                <label className="font-medium text-gray-800 dark:text-white/90 mb-1 block">
                GitHub URL
                </label>
                <input
                type="text"
                value={formData.gitHub_URL}
                onChange={(e) =>
                    setFormData({ ...formData, gitHub_URL: e.target.value })
                }
                placeholder="https://github.com/your-username"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                dark:bg-gray-700 dark:text-white/80"
                />
            </div>

            {/* Portfolio */}
            <div>
                <label className="font-medium text-gray-800 dark:text-white/90 mb-1 block">
                Portfolio URL
                </label>
                <input
                type="text"
                value={formData.portfolio_URL}
                onChange={(e) =>
                    setFormData({ ...formData, portfolio_URL: e.target.value })
                }
                placeholder="https://yourportfolio.com"
                className="bg-gray-200/50 text-black rounded-lg px-4 py-2 w-full 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                dark:bg-gray-700 dark:text-white/80"
                />
            </div>
            </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
