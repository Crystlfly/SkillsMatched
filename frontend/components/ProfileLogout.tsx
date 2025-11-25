"use client";
import { useEffect, useRef } from "react";


export default function ProfileLogout({isOpen, onCloseAction, user, mode}:{
    isOpen?:boolean,
    onCloseAction?:()=> void,
    user:any,
    mode: "desktop" | "mobile",
}) {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            onCloseAction?.();
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onCloseAction]);

    function removal(){
        localStorage.removeItem("token");
        window.location.href="/login";
    }

    if (mode === "mobile") {
        return (
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 mt-6">
            <p className="font-semibold text-black dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>

            <button
            onClick={removal}
            className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
            Logout
            </button>
        </div>
        );
    }

    if(!isOpen) return null;
    return (
        <div
        ref={menuRef}
        className="absolute top-14 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50 m-4"
        >
            <div className="border-b border-gray-300 dark:border-gray-600 pb-2 mb-2">
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{user.name}</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
            </div>
            <button
                onClick={removal}
                className="w-full bg-red-500 text-white py-1.5 rounded-md hover:bg-red-600 transition"
            >
                Logout
            </button>

        </div>
    )
}