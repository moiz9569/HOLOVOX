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

const Sidebar = () => {
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
    { label: "Summaries", icon: Activity, path: "/home/summaries" },
    { label: "Notes", icon: GrDocumentNotes, path: "/home/notes" },
    // { label: "Docs", icon: SiGoogledocs, path: "/home/docs" },
    { label: "Contact US", icon: IoMdContacts, path: "/home/contactus" },
  ];

  const userData = {
    name: decodedUser?.name,
    email: decodedUser?.email,
    avatar: decodedUser?.image,
    credits: 2450,
  };

  return (
   <motion.div
  initial={{ x: -300 }}
  animate={{ x: 0 }}
  className="fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-[#E51A54]"
>
  <div className="flex flex-col h-full">

    {/* NAV */}
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          icon={item.icon}
          label={item.label}
          active={pathname === item.path}
          onClick={() => router.push(item.path)}
        />
      ))}
    </nav>

    {/* BOTTOM AREA */}
    <div className="border-t border-gray-200 p-4 space-y-4">

      {/* PROFILE */}
      {/* <div className="flex items-center gap-3">
        <img
          src={userData.avatar}
          alt={userData.name}
          className="w-10 h-10 rounded-full object-cover border border-[#E9164B]"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {userData.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {userData.email}
          </p>
        </div>
      </div> */}

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/");
        }}
        className="w-full flex cursor-pointer items-center justify-center gap-2 py-2 rounded-lg border border-[#E51A54] text-[#E51A54] hover:bg-[#E51A54] hover:text-white transition"
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
