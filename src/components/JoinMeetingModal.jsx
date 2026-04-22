"use client";
import React, { useState, useEffect } from "react";
import { Mail, Loader2, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getTokenData } from "@/app/content/data";
import { showErrorToast } from "../../lib/toast";
import { Video } from "lucide-react";
import Image from "next/image";

const JoinMeetingModal = ({ isOpen,onClose, }) => {
  if (!isOpen) return null;
//   console.log("JoinMeetingModal rendered with isOpen:", isOpen);
//   console.log("onClose function:", onClose);
  const [joinCode, setJoinCode] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [decodedUser, setDecodedUser] = useState({});
const joinMeeting = async (e) => {
  e?.preventDefault();

  const meetingCode = joinCode.trim();
  const name = guestName.trim();
  const email = guestEmail.trim();

  console.log("Attempting to join meeting with:", {
    meetingCode,
    name,
    email,
  });

  if (!meetingCode) return;

  if (!name) {
    showErrorToast("Name is required");
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("/api/user/meeting", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        meetingId: meetingCode,
      }),
    });

    console.log("Response status:", res.status);

    const data = await res.json();
    console.log("API Response:", data);

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    localStorage.setItem(
      `meeting_guest_profile_${meetingCode}`,
      JSON.stringify({ name, email })
    );
    localStorage.setItem("meeting_data", meetingCode + "_" + name);
    onClose();
    window.location.reload();

    router.push(`/meeting-room/${meetingCode}?role=guest`);
    console.log("Navigation to meeting room successful");
  } catch (err) {
    console.error("Join Meeting Error:", err);
    showErrorToast(err?.message || "Failed to join meeting");
  } finally {
    setIsLoading(false);
  }
};
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
  <motion.div
    initial={{ scale: 0.8, opacity: 0, y: 40 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="w-full max-w-md bg-[#EAEAF4] rounded-3xl shadow-2xl p-6 sm:p-8 relative"
  >
    {/* Close Button */}
    <button
      onClick={onClose}
      disabled={isLoading}
      className="absolute top-4 right-4 text-gray-400 hover:text-[#E51A54] transition cursor-pointer"
    >
      ✕
    </button>

    {/* Top Icon */}
    <div className="flex justify-center">
      {/* <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#E51A54]/10"> */}
         <img src="/holo-new-logo.png" className="w-32 h-20" alt="Join Meeting" />
      {/* </div> */}
     
    </div>

    {/* Header */}
    <div className="text-center mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Join Meeting
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        Enter your details to continue
      </p>
    </div>

    {/* Name Input */}
    <div className="relative mb-4">
      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="Your name"
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E51A54] focus:border-transparent transition"
      />
    </div>

    {/* Email Input */}
    <div className="relative mb-4">
      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="email"
        value={guestEmail}
        onChange={(e) => setGuestEmail(e.target.value)}
        placeholder="Email (optional)"
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E51A54] focus:border-transparent transition"
      />
    </div>

    {/* Meeting ID */}
    <div className="relative mb-6">
      <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        placeholder="Enter meeting ID"
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E51A54] focus:border-transparent transition"
      />
    </div>

    {/* Button */}
    <button
      type="button"
      onClick={joinMeeting}
      disabled={!joinCode.trim() || !guestName.trim() || isLoading}
      className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200
        ${
          !joinCode.trim() || !guestName.trim() || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#E51A54] cursor-pointer hover:bg-[#c91442] text-white shadow-md hover:shadow-lg"
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



export default JoinMeetingModal;