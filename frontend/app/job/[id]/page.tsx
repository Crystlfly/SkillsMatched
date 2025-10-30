"use client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LuBuilding2 } from "react-icons/lu";
import dynamic from "next/dynamic";
const ApplyJobModal = dynamic(() => import("@/components/ApplyJobModal"),{ssr:false});


export default function JobDetailsPage() {
  const params = useParams();
  const [details, setDetails]=useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jobIdStr = params.id;
  if (!jobIdStr || Array.isArray(jobIdStr)) return <p>Invalid job ID</p>;
  const jobIdNum = Number(jobIdStr);
  if (isNaN(jobIdNum)) return <p>Invalid job ID</p>;

//   if (!details) {
//   return <p className="p-6">Loading job details...</p>;
// }


  useEffect(()=>{
    const fetchDetails = async()=>{
      try{
        const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${jobIdNum}`);
        const data = await res.json();
        setDetails(data);
      }
      catch(error){
        console.error("Error fetching job details:", error);
      }
    }
    if (jobIdNum) fetchDetails();
  },[jobIdNum]);
  if (!details) {
    return <p className="p-6">Loading job details...</p>;
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      {/* <header className="border-b bg-white shadow-sm p-4 flex justify-between items-center"> */}
        {/* <button className="text-blue-600 text-sm">← Back to Jobs</button> */}
        {/* <h1 className="text-xl font-semibold">JobConnect</h1> */}
        {/* <Button className="bg-purple-600 text-white">Post a Job</Button> */}
      {/* </header> */}
      <Link href="/jobs">
      <button className="text-blue-600 text-[10px] pl-10 pt-4 ">← Back to Jobs</button>
      </Link>
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 pl-6 pr-6 pt-1 dark:text-white">
        {/* LEFT SECTION */}

        <section className="lg:col-span-2 space-y-6">
          {/* Job Header */}
            
          <div className="bg-white p-6 rounded-2xl shadow dark:bg-gray-800">
  {/* Top section with icon + job details */}
  <div className="flex items-start gap-4">
    {/* Icon box */}
    <div className="bg-gray-200/70 p-3 rounded-xl flex items-center justify-center dark:bg-gray-700">
      <LuBuilding2 className="text-2xl text-gray-600 dark:text-gray-100" />
    </div>

    {/* Job Info */}
    <div className="flex-1">
      {/* Job title + Featured badge */}
      <div className="flex items-center">
        <h2 className="text-2xl font-bold">{details.title}</h2>
        {/* <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-sm font-medium">
          Featured
        </span> */}
      </div>

      {/* Company + location */}
      <p className="text-gray-600 dark:text-gray-400">{details.company} • {details.location}</p>

      {/* Job tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{details.type}</span>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">{details.location}</span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">${details.salary}</span>
      </div>
    </div>
  </div>

  {/* Description */}
  <p className="text-gray-500 mt-4 pl-16">
    {details.description}
  </p>
</div>


          {/* Job Details */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-6 dark:bg-gray-800">
            <div>
              <h3 className="text-lg font-semibold">About the Role</h3>
              <p className="text-gray-400 mt-2 ">
                {details.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Key Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2 dark:text-gray-400">
                {details.respnsblts && details.respnsblts.length > 0 ? (
                  details.respnsblts.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))
                ) : (
                  <li>No responsibilities provided</li>
                )}
              </ul>
            </div>


            <div>
              <h3 className="text-lg font-semibold">Requirements</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2 dark:text-gray-400">
                {details.requirements?.map((point: string, index: number)=>(
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Required Skills</h3>
              <ul className="flex flex-wrap gap-2 mt-2 dark:text-gray-400">
                {details.skills?.map((skill: string, index: number)=>(
                  <li key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Benefits & Perks</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2 dark:text-gray-400">
                {details.benefits?.map((benefit: string, index: number)=>(
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">About {details.company}</h3>
              <p className="text-gray-600 mt-2 dark:text-gray-400">
                {details.about}
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT SECTION (SIDEBAR) */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow dark:bg-gray-800">
            <p className="text-green-600 font-bold text-lg">${details.salary}</p>
            <p className="text-gray-600 dark:text-gray-400">Annual Salary</p>
            <div className="mt-4 text-gray-700 space-y-2 dark:text-gray-300">
              <p><b>Location:</b> {details.location}</p>
              {/* <p><b>Experience:</b> Senior</p> */}
              {/* <p><b>Applicants:</b> 127 applied</p>
              <p><b>Deadline:</b> March 15, 2024</p> */}
            </div>
            <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-4 bg-black text-white hover:bg-gray-900/93 dark:bg-white dark:text-black">Apply for this Job</Button>
            <Button variant="outline" className="w-full mt-2">Save Job</Button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow dark:bg-gray-800">
            <h4 className="font-semibold">About Company</h4>
            <p className="text-gray-600 dark:text-gray-400">{details.company} • 100-500 employees</p>
            <a href="#" className="text-blue-600 text-sm mt-2 inline-block">Visit Website →</a>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow dark:bg-gray-800">
            <h4 className="font-semibold">Similar Jobs</h4>
            <ul className="space-y-2 mt-2">
              <li className="border p-3 rounded-lg hover:shadow">
                Frontend Developer • TechCorp <br />
                <span className="text-sm text-gray-600 dark:text-gray-400">$90k - $120k</span>
              </li>
              <li className="border p-3 rounded-lg hover:shadow">
                Frontend Developer • TechCorp <br />
                <span className="text-sm text-gray-600 dark:text-gray-400">$90k - $120k</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
      {details && (
        <ApplyJobModal 
          isOpen={isModalOpen} 
          onCloseAction={() => setIsModalOpen(false)} 
          jobId={jobIdNum}
          jobTitle={details.title } 
        />
      )}
    </div>
  );
}
