"use client";
import React from "react";
import { Video, Users, Calendar, Clock, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { getTokenData } from "../content/data";
import { Podcast } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const HomeDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [decodedUser, setDecodedUser] = useState([]);
  const [meetingId, setMeetingId] = useState("");
  const [showFeatures, setShowFeatures] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    getTokenData()
      .then((user) => {
        console.log("Decoded User:", user);
        setDecodedUser(user || {});
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
    // fetchUser();
  }, []);

  const createMeeting = async () => {
    const id = uuidv4().slice(0, 6);
    setMeetingId(id);

    router.push(`/meeting/${id}?role=host`);
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(user.meetingId);
    alert("Meeting ID copied!");
  };

  useEffect(() => {
    const handleClickOutside = () => setShowFeatures(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const user = {
    name: decodedUser?.name,
    email: decodedUser?.email,
    avatar: decodedUser?.image,
    meetingId: meetingId,
  };
  return (
    <div className="min-h-screen text-black p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-[#E51A54] text-sm">
          Manage your meetings and collaborations
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {/* Create Meeting */}
        <div
          onClick={createMeeting}
          className="cursor-pointer p-6 rounded-2xl bg-[#E51A54] hover:scale-105 transition"
        >
          <Video className="mb-4 text-white" />
          <h3 className="font-semibold text-base text-white">New Meeting</h3>
          <p className="text-sm opacity-80 text-white">
            Start an instant meeting
          </p>
        </div>

        {/* Join Meeting */}
        <div className="cursor-pointer p-6 rounded-2xl bg-white text-black hover:scale-105 transition">
          <Users className="mb-4" />
          <h3 className="font-semibold text-base">Join Meeting</h3>
          <p className="text-sm text-black">Enter meeting ID</p>
        </div>

        <div className="cursor-pointer p-6 rounded-2xl bg-[#E51A54] text-white hover:scale-105 transition">
          <Calendar className="mb-4" />
          <h3 className="font-semibold text-white text-base">Schedule</h3>
          <p className="text-sm text-white">Plan your meetings</p>
        </div>

        {/* <div className="relative"> */}
          {/* Main Card */}
        <div className="relative">
  <div
    onClick={() => setShowOptions(!showOptions)}
    className="cursor-pointer p-6 rounded-2xl bg-white hover:scale-105 transition"
  >
    <Podcast className="mb-4 text-black" />
    <h3 className="font-semibold text-base text-black">
      View More Features
    </h3>
    <p className="text-sm opacity-80 text-black">
      Explore immersive modes
    </p>
  </div>

  {/* DROPDOWN */}
  {showOptions && (
    <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
      <button
        onClick={() => {
          router.push("/holo-at-me");
          setShowOptions(false);
        }}
        className="w-full cursor-pointer text-left px-4 py-3 hover:bg-[#E51A54]/10 transition"
      >
        Holo at me
      </button>

      <button
        onClick={() => {
          router.push("/podcast");
          setShowOptions(false);
        }}
        className="w-full cursor-pointer text-left px-4 py-3 hover:bg-[#E51A54]/10 transition"
      >
        Podcast
      </button>

      <button
        onClick={() => {
          router.push("/watch-podcast");
          setShowOptions(false);
        }}
        className="w-full cursor-pointer text-left px-4 py-3 hover:bg-[#E51A54]/10 transition"
      >
        Watch Podcast
      </button>
    </div>
  )}
</div>

          {/* Dropdown */}
          <AnimatePresence>
            {showFeatures && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-3 w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                {/* Option 1 */}
                <button
                  onClick={() => {
                    router.push("/holo");
                    setShowFeatures(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-[#E51A54]/10 transition"
                >
                  <p className="font-medium text-black">Holo at me</p>
                  <p className="text-xs text-gray-500">
                    Experience holographic presence
                  </p>
                </button>

                {/* Option 2 */}
                <button
                  onClick={() => {
                    router.push("/podcast");
                    setShowFeatures(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-[#E51A54]/10 transition border-t"
                >
                  <p className="font-medium text-black">Podcast</p>
                  <p className="text-xs text-gray-500">
                    Start your immersive podcast
                  </p>
                </button>

                {/* Option 3 */}
                <button
                  onClick={() => {
                    router.push("/watch-podcast");
                    setShowFeatures(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-[#E51A54]/10 transition border-t"
                >
                  <p className="font-medium text-black">Watch Podcast</p>
                  <p className="text-xs text-gray-500">
                    Watch live or recorded shows
                  </p>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      {/* </div> */}

      {/* Main Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white text-black rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar}
              className="w-20 h-20 rounded-full border-2 border-[#E51A54]"
            />
            <h2 className="mt-4 font-semibold text-gray-800 text-lg">
              {user.name}
            </h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {/* Personal Meeting ID */}
          <div className="mt-6 p-4 bg-[#EAEAF4] rounded-xl">
            <p className="text-sm text-black mb-2">Personal Meeting ID</p>
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#E51A54]">
                {/* {user.meetingId} */}
                836-361-382
              </span>
              <button onClick={copyMeetingId}>
                <Copy className="w-4 cursor-pointer h-4 text-[#E51A54]" />
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>

          <div className="space-y-4">
            {/* Meeting Item */}
            <div className="flex items-center justify-between p-4 bg-[#EAEAF4] rounded-xl">
              <div>
                <p className="font-medium">UI/UX Discussion</p>
                <p className="text-sm text-[#E51A54]">Today • 3:00 PM</p>
              </div>
              <button className="px-4 cursor-pointer py-2 bg-[#E51A54] text-white rounded-lg text-sm">
                Join
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#EAEAF4] rounded-xl">
              <div>
                <p className="font-medium">Team Standup</p>
                <p className="text-sm text-[#E51A54]">Tomorrow • 10:00 AM</p>
              </div>
              <button className="px-4 py-2 cursor-pointer bg-[#E51A54] rounded-lg text-sm text-white">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-white rounded-2xl border border-white/10">
          <Clock className="mb-2 text-[#E51A54]" />
          <h3 className="text-xl font-bold">48h</h3>
          <p className="text-sm text-[#E51A54]">Meeting Time</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-white/10">
          <Users className="mb-2 text-[#E51A54]" />
          <h3 className="text-xl font-bold">120</h3>
          <p className="text-sm text-[#E51A54]">Participants</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-white/10">
          <Video className="mb-2 text-[#E51A54]" />
          <h3 className="text-xl font-bold">32</h3>
          <p className="text-sm text-[#E51A54]">Meetings</p>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
