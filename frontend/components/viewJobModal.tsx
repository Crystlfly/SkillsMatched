"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {timeAgo} from "@/lib/timeAgo";
import { GrLocation } from "react-icons/gr";
import { BsCurrencyDollar } from "react-icons/bs";
import { TbContract } from "react-icons/tb";



export default function ViewJobModal({isOpen, onCloseAction, job}:{
    isOpen: boolean,
    onCloseAction: ()=> void,
    job:string
}){
    const [jobDetails, setJobDetails]=useState<any>(null);
    useEffect(() =>{
        
        const fetchJobDetails =async()=>{
            try{
                const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${job}`);
                const data=await res.json();
                setJobDetails(data);

            }catch(err){
                console.error("Error fetching job details:", err);
            }
        }
        if(job) fetchJobDetails ();
    },[job]);

    if(!isOpen) return null;
    if(!jobDetails) return <p>Loading job details...</p>;
   
    return(
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] p-6 relative overflow-y-auto">
            <button
                onClick={onCloseAction}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                <X size={22} />
            </button>
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{jobDetails.title}</h1>
            <p><strong className="text-sm text-gray-600 mt-1 dark:text-gray-100"></strong> {jobDetails.company}</p>
            <div className="grid grid-cols-3 gap-3 my-4 border-b pb-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <GrLocation className="text-blue-600 bg-blue-100 rounded-full p-1" size={40} />
                    <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="font-medium text-gray-900 whitespace-pre-line leading-snug">
                        {jobDetails.location}
                    </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <TbContract className="text-purple-600 bg-purple-100 rounded-full p-1" size={30}/>
                    <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">Job Type</p>
                    <p className="font-medium text-gray-900 whitespace-pre-line leading-snug">
                        {jobDetails.type}
                    </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <BsCurrencyDollar className="text-green-600 bg-green-100 rounded-full p-1" size={30}/>
                    <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">Salary</p>
                    <p className="font-medium text-gray-900 whitespace-pre-line leading-snug">
                        {jobDetails.salary}
                    </p>
                    </div>
                </div>
            </div>

            <div className="mb-4 border-b pb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {jobDetails.skills?.map((skill:string, i:number) => (
                    <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
                    >
                        {skill}
                    </span>
                    ))}
                </div>
                </div>

                <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Job Description</h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">{jobDetails.description}</p>
                </div>
                
                {jobDetails.respnsblts?.length>0 &&(
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Responsibilities</h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm">
                            {jobDetails.respnsblts?.map((resp:string, idx:number)=>(
                                <li key={idx}>
                                    {resp}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {jobDetails.requirements?.length>0 && (
                    <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                        {jobDetails.requirements?.map((req:string, i:number)=>(
                            <li key={i}>
                                {req}
                            </li>
                        ))}
                    </ul>
                    </div>
                )}

                {jobDetails.benefits?.length>0 && (
                    <div className="mb-4 border-b pb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Benefits</h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                        {jobDetails.benefits?.map((benefit:string, i:number)=>(
                            <li key={i}>{benefit}</li>
                        ))}
                    </ul>
                    </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mt-6 bg-gray-100 p-3 rounded-md">
                    <span>Posted {timeAgo(jobDetails.createdAt)}</span>
                    {/* <span>👥 {applicants} applicants</span> */}
                </div>

                <div className="flex gap-3 mt-5">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                        Deactivate Job
                    </button>
                    <button
                        onClick={onCloseAction}
                        className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded-lg font-medium"
                    >
                        Close Preview
                    </button>
                </div>

            </div>
        </div>
    )
}