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
    { label: "Docs", icon: SiGoogledocs, path: "/home/docs" },
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
      className="fixed lg:static inset-y-0 left-0 z-20 w-72 bg-gray-100 backdrop-blur-xl border-r border-[#E62064]"
    >
      {/* Flex container with full height and flex column */}
      <div className="flex flex-col h-screen">
        {/* Navigation - This will scroll if needed, but content won't overflow */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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

        {/* Profile - Always at bottom, never scrolls */}
        <div className="p-4 border-t border-white/10 bg-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-10 h-10 rounded-xl border-2 border-[#E9164B] object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {userData.name}
              </p>
              <p className="text-xs text-gray-600 truncate">{userData.email}</p>
            </div>

            <button className="p-2 hover:bg-white/10 rounded-lg transition shrink-0">
              <LogOut className="w-4 h-4 text-[#E62064]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ✅ NavItem Component
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        active
          ? "bg-[#E9164B] text-white"
          : "text-black hover:bg-[#E9164B]/50 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium truncate">{label}</span>
    </button>
  );
}

export default Sidebar;
