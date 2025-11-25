"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChrome } from "react-icons/fi";
import { LuLock } from "react-icons/lu";
import { MdMailOutline } from "react-icons/md";
import { useGoogleLogin } from "@react-oauth/google";



export default function LoginPage() {
  const router = useRouter();
  const [successOrError, setSuccessOrError] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",

  });

  useEffect(()=>{
    window.scrollTo({
      top:100,
      behavior:"smooth"
    });
  }, [])

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

    flow: "implicit", 
  });


  const handleGoogleLogin = () => {
    googleLogin();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        });

        if (res.ok) {
          setIsLoading(false);
          const data = await res.json();
          localStorage.setItem("token", data.token);
        setSuccessOrError(true);
        router.push("/cDashboard"); 
        } else {
          setIsLoading(false);
        const data = await res.json();
        setSuccessOrError(false);
        }
    } catch (error) {
      setIsLoading(false);
        console.error(error);
        alert("Something went wrong!");
    }
    };




  return (
    <div
      className="
        relative flex items-center justify-center min-h-screen
        bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400
        dark:bg-gradient-to-br dark:from-purple-950 dark:via-purple-900 dark:to-purple-800
      "
    >
      <div className="absolute top-[4rem] lg:top-[2.5rem] left-1/2 -translate-x-1/2 
  lg:left-[calc(50%-13.5rem)] lg:translate-x-0
                text-gray-900 dark:text-gray-200 underline">
        <a href="/" className="text-purple-900 dark:text-purple-100 underline ">
          Back to Home
        </a>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="mt-3 bg-white/50 dark:bg-gray-900 p-8 rounded-lg w-full max-w-md
          shadow-[0_0_50px_10px_rgba(168,85,247,0.7)]
          "
        >
        <h2 className="text-2xl font-bold mb-2 text-center dark:text-gray-100">Welcome Back</h2>
        <p className="text-sm mb-6 text-center dark:text-gray-100">Sign in to continue to your account</p>
        <button 
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 w-full bg-white text-black mb-4 p-2 rounded-sm justify-center">
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

        <div className="relative mb-4">
          <MdMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 text-xl font-bold" />

          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 pl-10 rounded-md 
border-2 border-purple-400 focus:border-purple-500
dark:border-purple-600 dark:focus:border-purple-400
dark:bg-gray-800 dark:text-white"
          />
        </div>


        <div className="relative mb-4">
          <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 font-bold" />

          <input
            type="password"
            name="password"
            placeholder="........"
            value={formData.password}
            onChange={handleChange}
            className="pl-10 w-full rounded-md py-2 
border-2 border-purple-400 focus:border-purple-500
dark:border-purple-600 dark:focus:border-purple-400
dark:bg-gray-800 dark:text-white"
          />
        </div>


        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-br from-blue-700 to-purple-600 text-white p-3 rounded transition transform hover:-translate-y-0.5 hover:shadow-xl
          shadow-[0_0_7px_1px_rgba(168,85,247,0.2)]"
        >
          {isLoading ? "Please wait..." : "Log In"}
        </button>
        {successOrError === true && (
          <p className="text-green-500 mt-4 text-center">Login successful!</p>
        )}
        {successOrError === false && (
          <p className="text-red-500 mt-4 text-center">Login failed. Please check your credentials.</p>
        )}
      </form>
    </div>
  );
}
