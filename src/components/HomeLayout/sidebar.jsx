"use client";
import React from "react";
import { Home, Users, MessageSquare, Activity, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { getTokenData } from "@/app/content/data";
import { useState, useEffect } from "react";
import { SiGoogledocs } from "react-icons/si";
import { GrDocumentNotes } from "react-icons/gr";
import { IoMdContacts } from "react-icons/io";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [decodedUser, setDecodedUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getTokenData();
        setDecodedUser(user || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const navItems = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "Meetings", icon: Users, path: "/home/meetings" },
    { label: "Recordings", icon: MessageSquare, path: "/home/recording" },
    // { label: "Summaries", icon: Activity, path: "/home/summaries" },
    { label: "Notes", icon: GrDocumentNotes, path: "/home/notes" },
    { label: "Chat", icon: MessageSquare, path: "/home/chat" },
    // { label: "Docs", icon: SiGoogledocs, path: "/home/docs" },
    { label: "Contact US", icon: IoMdContacts, path: "/home/contactus" },
  ];

  return (
   <motion.div
  initial={false}
 animate={{
  x: typeof window !== "undefined" && window.innerWidth >= 1024
    ? 0
    : isOpen
    ? 0
    : -300,
}}
  className={`
    fixed lg:static inset-y-0 left-0 z-20
    w-64 sm:w-72 lg:w-64
    bg-white border-r border-[#E51A54]
    transition-all duration-300

    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0   /* ✅ FORCE SHOW ON LARGE SCREEN */
  `}
>
      <div className="flex flex-col h-full">
        
        {/* NAV */}
        <nav className="flex-1 overflow-y-auto mt-20 lg:mt-0 px-3 py-4 space-y-2">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              active={pathname === item.path}
              onClick={() => {
                router.push(item.path);
                setIsOpen(false); // ✅ close on mobile click
              }}
            />
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
            className="w-full cursor-pointer flex items-center justify-center gap-2 py-2 rounded-lg border border-[#E51A54] text-[#E51A54] hover:bg-[#E51A54] hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 h-11 rounded-lg transition ${
        active
          ? "bg-[#E51A54] text-white"
          : "text-gray-700 hover:bg-[#E51A54]/10 hover:text-[#E51A54] cursor-pointer"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default Sidebar;
