"use client";
import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  Video,
  Users,
  Calendar,
  Settings,
  LogOut,
  Mail,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

// ✅ Separate Modal Component
const MeetingModal = ({ onClose }) => {
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  const joinMeeting = () => {
    if (!joinCode.trim()) return alert("Enter meeting code!");
    router.push(`/meeting/${joinCode}?role=guest`);
    onClose(); // close modal after join
  };

  return (
    <div className="fixed inset-0 mt-80 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0f172a] p-8 rounded-2xl w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-white hover:text-red-400"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Join Meeting</h2>
          <p className="text-white/60 text-sm">
            Enter Meeting ID to continue
          </p>
        </div>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter meeting ID"
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          />
        </div>

        <button
          onClick={joinMeeting}
          className="w-full cursor-pointer py-3 bg-[#E9164B] rounded-xl text-white font-semibold hover:bg-[#B30E3A]"
        >
          Join Meeting
        </button>
      </motion.div>
    </div>
  );
};

const AdminHeader = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ✅ Dummy user data (later replace with backend)
  const userData = {
    name: "Talha Ahmed",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  };

  const createMeeting = () => {
    const roomId = uuidv4().slice(0, 6);
    router.push(`/meeting/${roomId}?role=host`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0C0C2A]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          
          {/* Create */}
          <button
            onClick={createMeeting}
            className="hidden cursor-pointer md:flex items-center gap-2 px-4 py-2 border border-white rounded-lg text-sm hover:bg-[#E9164B] hover:border-none transition"
          >
            <Video className="w-4 h-4" />
            Create
          </button>

          {/* Join */}
          <button
            onClick={() => setShowModal(true)}
            className="hidden cursor-pointer md:flex items-center gap-2 px-4 py-2 bg-[#E9164B] rounded-lg text-sm"
          >
            <Video className="w-4 h-4" />
            Join
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <Bell className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-[#111133] rounded-xl p-4"
                >
                  <p className="text-sm text-white/60">
                    No new notifications
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2"
            >
              <img
                src={userData.avatar}
                className="w-8 h-8 rounded-lg"
              />
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-[#111133] rounded-xl"
                >
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full p-3 text-left hover:bg-white/5 flex gap-2"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>

                  <button
                    onClick={() => router.push("/settings")}
                    className="w-full p-3 text-left hover:bg-white/5 flex gap-2"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>

                  <button className="w-full p-3 text-left hover:bg-white/5 flex gap-2 border-t border-white/10">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && <MeetingModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default AdminHeader;