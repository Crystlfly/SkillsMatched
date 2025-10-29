"use client";
import Image from "next/image";
import styles from "./components/typingAnimation.module.css";
import { useRouter } from "next/navigation";
import { LuBrain } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";
import { HiOutlineBolt } from "react-icons/hi2";
import { LuTarget } from "react-icons/lu";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";


export default function Home() {
  const router = useRouter();
  return (
    <div className="w-screen overflow-x-hidden">
      <nav className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SkillsMatched</span>
        </div>
        <div className="space-x-8">
          <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">Find Jobs</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">Companies</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">Resources</a>
          <button 
          onClick={() => router.push("/login")}
          className="px-6 py-3 rounded-md font-bold bg-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm hover:shadow-2xl transition-all">
            Log In
          </button>
          <button 
          onClick={() => router.push("/signup")}
          className="px-6 py-3 rounded-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 shadow-lg hover:shadow-md transform hover:scale-105 transition-all duration-200">
            Sign Up
          </button>
        </div>
        {/* <div className="sm:hidden">
          <button className="text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div> */}
      </nav>
      
      <div className="w-screen flex flex-col md:flex-row items-center justify-center md:justify-between min-h-screen pt-24 bg-gradient-to-b from-blue-900 to-indigo-800">
        <div className="p-8 md:pl-16 md:pt-8 flex flex-col items-center md:items-start">
          <div className="flex flex-col mb-4">
            <div className={styles.typingContainer}>
              <span className={`text-4xl sm:text-5xl pr-[4px] md:text-6xl lg:text-7xl font-bold text-white whitespace-nowrap overflow-hidden pr-2 border-r-4 border-solid border-white ${styles.typing} ${styles.line1}`}>Your Next</span>
              <br />
              <span className={`text-4xl sm:text-5xl pr-[4px] md:text-6xl lg:text-7xl font-bold text-cyan-400 whitespace-nowrap overflow-hidden pr-2 border-r-4 border-solid border-cyan-400 ${styles.typing} ${styles.line2}`}>Career Move</span>
              <br />
              <span className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white whitespace-nowrap overflow-hidden pr-2 border-r-4 border-solid border-white ${styles.typing} ${styles.line3}`}>Starts Here...</span>
            </div>

          </div>
          <p className="text-lg text-gray-200 mb-6 max-w-lg mt-4 text-center md:text-left">Join over 500,000 professionals who've found their dream jobs through our AI-powered platform. Get matched with opportunities that align with your goals.</p>
          <button className="px-6 py-3 bg-white text-blue-800 font-semibold rounded-md transition-colors shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200">Find Your Dream Job →</button>
        </div>
        
        <div className="relative inline-block">
          <div className="mt-16 md:mt-16 md:pt-8 md:pr-32 p-8">
          <Image src="/main.jpeg" alt="Main" width={500} height={300} className="rounded-lg shadow-2xl" />
          </div>

          {/* Fixed label inside the image container */}
          <span className="absolute top-20 right-24 inline-flex items-center space-x-2 px-4 py-2 text-lg font-medium text-white rounded-lg shadow-2xl" style={{ backgroundColor: "#00c77b" }}>
            <FaRegStar size={20} color="white" />
            <span>Perfect Match!</span>
          </span>


          <span className="absolute bottom-4 left inline-block px-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-2xl">
            <AutoAwesomeOutlinedIcon style={{ color: 'white', fontSize: 20, marginRight:'10px' }} />
            AI Powered
          </span>
        </div>

        
      </div>

      <div className="w-screen bg-gradient-to-b from-white to-blue-200 relative">
        <div className="w-screen absolute inset-0 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[length:20px_20px] opacity-20"></div>
        <div className="flex justify-center mb-4">
          
          <span className="inline-flex items-center space-x-2 px-3 py-1 mt-32 text-sm font-medium border border-black rounded bg-white/100 backdrop-blur-md shadow-md text-black">
            <LuBrain size={15} color="black" />
            <span>Powered by Advanced AI</span>
          </span>

        </div>
        <div className="text-center">
        <span className="text-black sm:text-5xl font-semibold text-centre">The future of Job Hunting is </span>
        <span className="text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">Here</span>
        <p className="text-gray-700 mt-4 mb-16 max-w-2xl mx-auto px-4 text-base">
          Experience job searching reimagined with AI that understands your career goals, skills, and aspirations to connect you with opportunities that truly matter.
        </p>
        </div>
        <div className="flex justify-between space-x-6">
          
          <div className="text-left ml-24 mr-24 mb-24">
            <h1 className="font-bold text-3xl text-black">How our AI works for you</h1>
            <ul className="space-y-4 list-none mt-4">
              <li className="flex items-start space-x-4">
                {/* Gradient square bullet */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 mt-2 backdrop-blur-md">
                  <LuBrain style={{ color: 'white', fontSize: 24, margin: '8px' }} />
                </div>
                
                <div className="text-left">
                  <span className="font-bold text-lg text-black">Smart Matching</span>
                  <p className="text-gray-500">Our AI analyzes 200+ data points to find your perfect job match</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 mt-2 backdrop-blur-md">
                  <HiOutlineBolt style={{ color: 'white', fontSize: 24, margin: '8px' }} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-lg text-black">Instant Results</span>
                  <p className="text-gray-500 font-thin">Apply to top jobs in just a few clicks with our streamlined process</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 mt-2 backdrop-blur-md">
                  <LuTarget style={{ color: 'white', fontSize: 24, margin: '8px' }} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-lg text-black">Precision Targeting</span>
                  <p className="text-gray-500 font-thin">97% accuracy in matching candidates with suitable positions</p>
                </div>
              </li>
            </ul>
            <button className="px-6 py-3 mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md transition-colors shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 backdrop-blur-md">
              Try Matching →
            </button>

          </div>
          <div className="relative inline-block w-full max-w-xs md:max-w-md lg:max-w-xl mr-8">
            <div className="absolute -top-7 left-5 right-15 bottom-20 rounded-xl bg-white/80 backdrop-blur-md shadow-lg z-0 overflow-hidden p-8 ">
              <Image src="/main.jpeg" alt="Main" width={500}
                height={300} className="rounded-lg shadow-2xl object-cover w-full h-full" />
            </div>

            {/* Labels / icons */}
            <span className="absolute -top-12 right-6 px-2 py-2 text-sm font-medium text-white rounded-lg shadow-2xl" style={{ backgroundColor: "#0ed086ff" }}>
              <CheckCircleOutlinedIcon style={{ color: 'white', fontSize: 16, marginRight:'5px' }} />
              Match Found!
            </span>

            <span className="absolute bottom-15 -left-7 inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-2xl">
              <LuBrain size={15} color="white" />
              <span>AI Analysing...</span>
            </span>

          </div>
        </div>
      </div>
      <div className="text-center w-screen bg-gradient-to-br from-blue-700 via-purple-700 to-blue-700 p-16">
        <h1 className="text-4xl font-extrabold">Ready to Transform Your Career?</h1>
        <p className="text-center text-sm md:text-base lg:text-lg font-thin mt-4">
          Join hundreds of thousands of professionals
        </p>
        <p className="text-center text-sm md:text-base lg:text-lg text-grey/50">
          who've accelerated their careers with JobConnect's AI-powered platform.
        </p>
        <div className="flex justify-center space-x-6 mt-8">
          <button
          onClick={() => router.push("/signup")} 
          className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-md transition-colors shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Create Your Profile
          </button>
          <button className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-md transition-colors shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Post a Job Opening
          </button>
        </div>

      </div>
      
      <footer className="bg-[#0d1523] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-violet-600 rounded-md flex items-center justify-center">
  
                <span className="text-white font-bold">👜</span>
              </div> */}
              <span className="text-2xl font-bold text-white">SkillsMatched</span>
            </div>
            <p className="mt-4 leading-relaxed">
              Revolutionizing job searching with AI-powered matching
              technology. Connect talent with opportunity like never before.
            </p>


            <div className="flex space-x-3 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center hover:bg-violet-600"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center hover:bg-violet-600"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center hover:bg-violet-600"
              >
                <FaGithub />
              </a>
            </div>
          </div>


          <div className="ml-19">
            <h3 className="font-semibold text-white text-xl">For Job Seekers</h3>
            <ul className="mt-4 space-y-2 ">
              <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-white">AI Job Matching</a></li>
              <li><a href="#" className="hover:text-white">Career Resources</a></li>
              <li><a href="#" className="hover:text-white">Resume Builder</a></li>
            </ul>
          </div>


          <div className="ml-19">
            <h3 className="font-semibold text-white text-xl">For Employers</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-white">Post Jobs</a></li>
              <li><a href="#" className="hover:text-white">Find Talent</a></li>
              <li><a href="#" className="hover:text-white">Pricing Plans</a></li>
              <li><a href="#" className="hover:text-white">Enterprise</a></li>
            </ul>
          </div>

          <div className="ml-19">
            <h3 className="font-semibold text-white text-xl">Company</h3>
            <ul className="mt-4 space-y-2 ">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© 2025 SkillsMatched. All rights reserved.</p>
          <p className="mt-4 md:mt-0">
            Made with <span className="text-red-500">♥</span> for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
    </div>
  );
}
