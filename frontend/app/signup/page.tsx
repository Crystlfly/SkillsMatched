"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChrome } from "react-icons/fi";
import { LuLock } from "react-icons/lu";
import { MdMailOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { PiSuitcaseSimple } from "react-icons/pi";
import { useGoogleLogin } from "@react-oauth/google";

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole]=useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role:"",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(()=>{
    window.scrollTo({
      top:100,
      behavior:"smooth"
    });
  },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const backendRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        }
      );

      const data = await backendRes.json();

      if (backendRes.ok) {
        localStorage.setItem("token", data.token || data.accessToken);
        router.push("/cDashboard");
      } else {
        alert(data.message);
      }
    },

    onError: () => alert("Google login failed"),

    flow: "implicit", // important for SPA
  });


  const handleGoogleLogin = () => {
    googleLogin();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
        alert("Passwords do not match!");
        return;
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        });

        if (res.ok) {
          setIsLoading(false);
        alert("Signup successful!");
        router.push("/login"); 
        } else {
          setIsLoading(false);
        const data = await res.json();
        alert(data.message || "Signup failed");
        }
    } catch (error) {
      setIsLoading(false);
        console.error(error);
        alert("Something went wrong!");
    }
    };


  return (
    
    <div className=" py-20 relative flex items-center justify-center min-h-screen 
    bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400
    dark:bg-gradient-to-br dark:from-blue-950 dark:via-blue-900 dark:to-blue-800
    ">
      <div className="absolute top-[3rem] left-[calc(50%-13.5rem)] 
                text-gray-900 dark:text-gray-200 underline">
        <a href="/" className="text-blue-900 dark:text-blue-100 underline ">
          Back to Home
        </a>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="bg-white/50 dark:bg-gray-900 p-8 rounded-lg w-full max-w-md
        shadow-[0_0_50px_10px_rgba(59,130,246,0.7)]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <p className="text-sm mb-6 text-center dark:text-gray-100">Join thousands of professionals finding their dream jobs</p>
        <button 
        onClick={handleGoogleLogin}
        className="flex gap-2 w-full bg-white text-black mb-4 p-2 rounded-sm justify-center">
          <FiChrome className="mt-1 ml-2"/>
          Continue with Google
          </button>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-gray-400"></div>

          <p className="inline-block bg-gray-900/60 dark:bg-gray-200/20 text-white px-3 py-1 rounded-md">
            or continue with email
          </p>

          <div className="flex-1 h-px bg-gray-400"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button 
            onClick={() => {setSelectedRole("CANDIDATE");
              setFormData(prev =>({ ...prev, role: "CANDIDATE" }));
            }}
            
            className={`
              rounded-sm text-center p-4 transition-all 
              ${selectedRole === "CANDIDATE" 
                ? "border-2 border-blue-500 bg-blue-500/10" 
                : "border-2 border-blue-400/30 dark:border-blue-600/30"} 
            `}
          >
            <FaRegUser 
              className={`
                mx-auto text-xl transition-all
                ${selectedRole === "CANDIDATE" 
                  ? "text-blue-500" 
                  : "text-blue-400 dark:text-blue-100/50"}
              `}
            />
            <p className={selectedRole === "CANDIDATE" 
                  ? "text-blue-500" 
                  : "text-blue-400 dark:text-blue-100/50"}>
              Find Jobs
            </p>
          </button>

          <button 
            onClick={() => {setSelectedRole("RECRUITER");
              setFormData(prev =>({ ...prev, role: "RECRUITER" }));
            }}
            className={`
              rounded-sm text-center p-4 transition-all 
              ${selectedRole === "RECRUITER" 
                ? "border-2 border-blue-500 bg-blue-500/10" 
                : "border-2 border-blue-400/30 dark:border-blue-600/30"} 
            `}
          >
            <PiSuitcaseSimple 
              className={`
                mx-auto text-xl transition-all
                ${selectedRole === "RECRUITER" 
                  ? "text-blue-500" 
                  : "text-blue-400 dark:text-blue-100/50"}
              `}
            />
            <p className={selectedRole === "RECRUITER" 
                  ? "text-blue-500" 
                  : "text-blue-400 dark:text-blue-100/50"}>
              Hire Talent
            </p>
          </button>

        </div>

        <div className="relative mb-4">
          <FaRegUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-xl font-bold" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 pl-10 rounded-md 
            border-2 border-blue-400 focus:border-blue-500
            dark:border-blue-600 dark:focus:border-blue-400
            dark:bg-gray-800 dark:text-white
            "
          />
        </div>

        <div className="relative mb-4">
          <MdMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-xl font-bold" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 pl-10 rounded-md 
              border-2 border-blue-400 focus:border-blue-500
              dark:border-blue-600 dark:focus:border-blue-400
              dark:bg-gray-800 dark:text-white
              "
          />
        </div>

        <div className="relative mb-4">
          <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-bold" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="pl-10 w-full rounded-md py-2 
              border-2 border-blue-400 focus:border-blue-500
              dark:border-blue-600 dark:focus:border-blue-400
              dark:bg-gray-800 dark:text-white
              "
          />
        </div>

        <div className="relative mb-4">
          <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-bold" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="pl-10 w-full rounded-md py-2 
              border-2 border-blue-400 focus:border-blue-500
              dark:border-blue-600 dark:focus:border-blue-400
              dark:bg-gray-800 dark:text-white
              "
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-br from-blue-700 to-purple-600 text-white p-3 rounded hover:bg-blue-600
          shadow-[0_0_7px_1px_rgba(59,130,246,0.2)]
          "
        >
          {isLoading ? "Please wait..." : "Sign Up"}
        </button>
        <p className="p-2 text-center">By creating an account, you agree to our Terms of Service and Privacy Policy</p>
      </form>
    </div>
  );
}
