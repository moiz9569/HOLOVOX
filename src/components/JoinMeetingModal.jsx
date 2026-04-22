"use client";
import React, { useState, useEffect } from "react";
import { Mail, Loader2, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getTokenData } from "@/app/content/data";
import { showErrorToast } from "../../lib/toast";

const JoinMeetingModal = ({ isOpen,onClose }) => {
  if (!isOpen) return null;
  console.log("JoinMeetingModal rendered with isOpen:", isOpen);
  console.log("onClose function:", onClose);
  const [joinCode, setJoinCode] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [decodedUser, setDecodedUser] = useState({});

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const user = await getTokenData();
//         const safeUser = user || {};
//         setDecodedUser(safeUser);
//         setGuestName(safeUser?.name || "");
//         setGuestEmail(safeUser?.email || "");
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

  const joinMeeting = async () => {
    const meetingCode = joinCode.trim();
    const name = guestName.trim();
    const email = guestEmail.trim();

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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  localStorage.setItem(
    `meeting_guest_profile_${meetingCode}`,
    JSON.stringify({ name, email })
  );

  router.push(`/meeting-room/${meetingCode}?role=guest`);

} catch (err) {
  console.error("Join Meeting Error:", err);
  showErrorToast(err?.message || "Failed to join meeting");
} finally {
  setIsLoading(false);
}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-200 p-8 rounded-2xl w-full max-w-md relative"
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
          <p className="text-gray-600 text-sm">Enter details to continue</p>
        </div>

        <div className="relative mb-4">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your name"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-[#E51A54] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E51A54]"
          />
        </div>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-[#E51A54] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E51A54]"
          />
        </div>

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
          disabled={!joinCode.trim() || !guestName.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition
            ${
              !joinCode.trim() || !guestName.trim() || isLoading
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



export default JoinMeetingModal;