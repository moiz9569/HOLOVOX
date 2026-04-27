// "use client";
// import React from "react";
// import {
//   Menu,
//   Search,
//   Bell,
//   User,
//   ChevronDown,
//   Video,
//   Users,
//   Calendar,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { useRouter } from "next/navigation";

// const Header = () => {
//   const router = useRouter();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [modal, setmodal] = useState(false);
//   const createMeeting = () => {
//     const roomId = uuidv4().slice(0, 6);
//     router.push(`/meeting/${roomId}?role=host`);
//   };
//   function MeetingModal() {
//     const [joinCode, setJoinCode] = useState("");
//     const router = useRouter();
//     const joinMeeting = () => {
//       if (!joinCode.trim()) return alert("Enter meeting code!");
//       router.push(`/meeting/${joinCode}?role=guest`);
//     };

//     return (
//       <motion.form
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="space-y-6"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//           <p className="text-white/60">
//             Enter Meeting ID to Join to Get Started
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-white/80 mb-2">
//               Meeting ID
//             </label>
//             <div className="relative">
//               <Mail
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 onChange={(e) => setJoinCode(e.target.value)}
//                 value={joinCode}
//                 placeholder="Enter meeting ID"
//                 className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#E9164B] transition-colors"
//               />
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           onClick={joinMeeting}
//           className="w-full cursor-pointer py-4 bg-linear-to-r from-[#E9164B] to-[#E9164B] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 relative overflow-hidden group"
//         >
//           <span className="relative z-10">Join Meeting</span>
//           <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
//         </button>
//       </motion.form>
//     );
//   }

//   return (
//     <header className="sticky top-0 z-40 bg-[#0C0C2A]/80 backdrop-blur-xl border-b border-white/10">
//       <div className="flex items-center justify-between px-6 py-4">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
//           >
//             <Menu className="w-5 h-5" />
//           </button>

//           {/* Search */}
//           <div className="relative hidden md:block">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
//             <input
//               type="text"
//               placeholder="Search calls, meetings..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-80 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#E9164B] transition-colors"
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={createMeeting}
//             className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-[#E9164B] border border-white hover:border-none rounded-lg text-sm font-medium transition"
//           >
//             <Video className="w-4 h-4" />
//             Create New Meeting
//           </button>
//           {/* Quick Join */}
//           <button
//             onClick={() => setmodal(true)}
//             className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#E9164B] hover:bg-[#B30E3A] rounded-lg text-sm font-medium transition"
//           >
//             <Video className="w-4 h-4" />
//             Quick Join
//           </button>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="p-2 hover:bg-white/10 rounded-lg transition relative"
//             >
//               <Bell className="w-5 h-5" />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-[#E9164B] rounded-full" />
//             </button>

//             <AnimatePresence>
//               {showNotifications && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   className="absolute right-0 mt-2 w-80 bg-[#111133] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
//                 >
//                   <div className="p-4 border-b border-white/10">
//                     <h3 className="font-semibold">Notifications</h3>
//                   </div>
//                   <div className="max-h-96 overflow-y-auto">
//                     <NotificationItem
//                       icon={Video}
//                       title="Meeting starting soon"
//                       description="UI/UX Design Review in 5 minutes"
//                       time="5 min ago"
//                     />
//                     <NotificationItem
//                       icon={Users}
//                       title="New participant"
//                       description="Sarah Chen joined the meeting"
//                       time="10 min ago"
//                     />
//                     <NotificationItem
//                       icon={Calendar}
//                       title="Meeting scheduled"
//                       description="Product Roadmap for tomorrow"
//                       time="1 hour ago"
//                     />
//                   </div>
//                   <div className="p-3 border-t border-white/10">
//                     <button className="w-full text-center text-sm text-[#E9164B] hover:text-[#B30E3A] transition">
//                       View all notifications
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* User Menu */}
//           <div className="relative">
//             <button
//               onClick={() => setShowUserMenu(!showUserMenu)}
//               className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-lg transition"
//             >
//               <img
//                 src={userData.avatar}
//                 alt={userData.name}
//                 className="w-8 h-8 rounded-lg"
//               />
//               <ChevronDown className="w-4 h-4 text-white/60" />
//             </button>

//             <AnimatePresence>
//               {showUserMenu && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   className="absolute right-0 mt-2 w-48 bg-[#111133] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
//                 >
//                   <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2">
//                     <User className="w-4 h-4" />
//                     <span>Profile</span>
//                   </button>
//                   <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2">
//                     <Settings className="w-4 h-4" />
//                     <span>Settings</span>
//                   </button>
//                   <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2 border-t border-white/10">
//                     <LogOut className="w-4 h-4" />
//                     <span>Logout</span>
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//       {modal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//           <div className="bg-[#0f172a] p-8 rounded-2xl w-full max-w-md relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setmodal(false)}
//               className="absolute top-4 right-4 text-white hover:text-red-400"
//             >
//               ✕
//             </button>

//             <MeetingModal />
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, Video, Mail, Loader2, User, KeyRound, ChevronDown, SquarePen } from "lucide-react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { getTokenData } from "@/app/content/data";

const MeetingModal = ({ onClose }) => {
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [decodedUser, setDecodedUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // setLoading(true);
        const user = await getTokenData();
        // console.log("Decoded User:", user);
        setDecodedUser(user || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);
  const joinMeeting = async () => {
    if (!joinCode.trim()) return;
    console.log("Joining meeting with ID:", joinCode);
    setIsLoading(true);
    // console.log("Creating meeting with ID:", roomId);
    console.log("Creating meeting with userID:", decodedUser?.id);
    try {
      const res = await fetch("/api/user/meeting", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostId: decodedUser?.id,
          name: decodedUser?.name,
          email: decodedUser?.email,
          meetingId: joinCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // ✅ success pe redirect
      router.push(`/meeting-room/${joinCode}?role=guest`);
    } catch (err) {
      console.error("Create Meeting Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-200 p-8 rounded-2xl w-[85%] sm:w-full max-w-md relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#E51A54] transition disabled:hover:text-gray-400 cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Join Meeting</h2>
          <p className="text-gray-600 text-sm">Enter Meeting ID to continue</p>
        </div>

        {/* Input */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter meeting ID"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-[#E51A54] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E51A54]"
          />
        </div>

        {/* Button */}
        <button
          onClick={joinMeeting}
          disabled={!joinCode.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition
            ${
              !joinCode.trim() || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#E51A54] cursor-pointer hover:bg-[#B30E3A] text-white"
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Joining...
            </>
          ) : (
            "Join Meeting"
          )}
        </button>
      </motion.div>
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const router = useRouter();
  const userMenuRef = useRef(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [decodedUser, setDecodedUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // setLoading(true);
        const user = await getTokenData();
        // console.log("Decoded User:", user);
        setDecodedUser(user || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ✅ Dummy user data (later replace with backend)
  const userData = {
    name: decodedUser?.name || "User",
    avatar: decodedUser?.image,
    role: decodedUser?.role || "user",
  };

  const handleViewProfile = () => {
    setShowUserMenu(false);
    router.push("/home/profile");
  };

  const createMeeting = async () => {
    const roomId = uuidv4().slice(0, 6);

    console.log("Creating meeting with ID:", roomId);
    console.log("Creating meeting with userID:", decodedUser?.id);
    
    setCreateLoading(true);
    
    try {
      const res = await fetch("/api/user/meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostId: decodedUser?.id,
          name: decodedUser?.name,
          email: decodedUser?.email,
          meetingId: roomId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // ✅ success pe redirect
      router.push(`/meeting-room/${roomId}?role=host`);
    } catch (err) {
      console.error("Create Meeting Error:", err);
      // Reset loader after 6 seconds on error
      setTimeout(() => setCreateLoading(false), 6000);
    }
  };

  return (
    <header className="sticky top-0 h-14 sm:h-16 z-40 bg-white/95 backdrop-blur border-b border-[#E51A54]/30 shadow-[0_2px_16px_rgba(229,26,84,0.08)]">
      <div className="flex items-center justify-between h-full px-3 sm:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/holo-new-logo.png"
              alt="HoloVox"
              className="h-12 -ml-4 sm:ml-0 object-contain"
            />
            <img
              src="/holo-logo-2.png"
              alt="HoloVox"
              className="-ml-2 h-10 hidden sm:block object-contain"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Create */}
          <button
            onClick={createMeeting}
            disabled={createLoading}
            className={`cursor-pointer flex items-center justify-center gap-2 px-3 sm:px-4 h-9 sm:h-10 rounded-lg text-xs sm:text-sm transition ${
              createLoading
                ? "bg-[#E51A54] text-white border border-[#E51A54]"
                : "border border-[#E51A54] text-[#E51A54] hover:bg-[#E51A54] hover:text-white"
            }`}
          >
            {createLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4"
                >
                  <Video className="w-4 h-4" />
                </motion.div>
                <span className="hidden sm:inline">Creating...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </>
            )}
          </button>

          {/* Join */}
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer flex items-center justify-center gap-2 px-3 sm:px-4 h-9 sm:h-10 bg-[#E51A54] hover:bg-[#c91548] text-white rounded-lg text-xs sm:text-sm transition"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Join</span>
          </button>

          {/* USER */}
          <div className="relative" ref={userMenuRef}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex cursor-pointer rounded-2xl items-center gap-2 pl-1 pr-1.5 py-1 hover:bg-[#E51A54]/10 transition"
              >
                <img
                  src={userData.avatar || "https://via.placeholder.com/120x120?text=User"}
                  alt={userData.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E51A54]"
                />
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 bg-gradient-to-r from-[#E51A54]/10 to-[#E51A54]/5 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800 truncate">{userData.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{userData.role}</p>
                </div>

                {(decodedUser?.role === "doctor" || decodedUser?.role === "lawyer") ? (
                  <button
                    onClick={handleViewProfile}
                    className="w-full px-4 py-3 text-sm text-left hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </button>
                ) : null}

                <button
                  disabled
                  className="w-full px-4 py-3 text-sm text-left bg-gray-50 text-gray-400 flex items-center justify-between cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    <SquarePen className="w-4 h-4" />
                    Edit Profile
                  </span>
                  <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                </button>

                <button
                  disabled
                  className="w-full px-4 py-3 text-sm text-left bg-gray-50 text-gray-400 flex items-center justify-between cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    Change Password
                  </span>
                  <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && <MeetingModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default Header;
