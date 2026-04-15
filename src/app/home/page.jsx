"use client";
import React from "react";
import { Video, Users, Calendar, Clock, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { getTokenData } from "../content/data";
import { Podcast } from "lucide-react";

const HomeDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [decodedUser, setDecodedUser] = useState([]);
  const [meetingId, setMeetingId] = useState("");

  useEffect(() => {
    // const fetchUser = async () => {
    //   try {
    //     setLoading(true);
    //     const user = await getTokenData();
    //     console.log("Decoded User:", user);
    //     setDecodedUser(user || {});
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
getTokenData().then((user) => {
  console.log("Decoded User:", user);
  setDecodedUser(user || {});
  setLoading(false);
}).catch((error) => {
  console.error("Error fetching user data:", error);
  setLoading(false);
});
    // fetchUser();
  }, []);

 

  const createMeeting = async() => {
    const id = uuidv4().slice(0, 6);
    setMeetingId(id);
  
    router.push(`/meeting/${id}?role=host`);
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(user.meetingId);
    alert("Meeting ID copied!");
  };

  const goToPodcastLanding = () => {
    router.push("/podcast");
  };
   const user = {
    name: decodedUser?.name,
    email: decodedUser?.email,
    avatar: decodedUser?.image,
    meetingId:meetingId ,
  };
  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-[#E9164B] text-sm">
          Manage your meetings and collaborations
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Create Meeting */}
        <div
          onClick={createMeeting}
          className="cursor-pointer p-6 rounded-2xl bg-[#E9164B] hover:scale-105 transition"
        >
          <Video className="mb-4 text-white" />
          <h3 className="font-semibold text-lg text-white">New Meeting</h3>
          <p className="text-sm opacity-80 text-white">
            Start an instant meeting
          </p>
        </div>

        {/* Join Meeting */}
        <div className="p-6 rounded-2xl bg-gray-100 text-black hover:bg-gray-200 transition">
          <Users className="mb-4" />
          <h3 className="font-semibold text-lg">Join Meeting</h3>
          <p className="text-sm text-black">Enter meeting ID</p>
        </div>

        <div
          onClick={goToPodcastLanding}
          className="cursor-pointer p-6 rounded-2xl bg-[#E9164B] hover:scale-105 transition"
        >
          <Podcast className="mb-4 text-white" />
          <h3 className="font-semibold text-lg text-white">Podcast Mode</h3>
          <p className="text-sm opacity-80 text-white">
            Immersive 3D experience
          </p>
        </div>

        {/* Schedule */}
        <div className="p-6 rounded-2xl bg-gray-100 text-black hover:bg-gray-200 transition">
          <Calendar className="mb-4" />
          <h3 className="font-semibold text-lg">Schedule</h3>
          <p className="text-sm text-black">Plan your meetings</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-gray-100 text-black rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar}
              className="w-20 h-20 rounded-full border-2 border-[#E9164B]"
            />
            <h2 className="mt-4 font-semibold text-gray-800 text-lg">
              {user.name}
            </h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {/* Personal Meeting ID */}
          <div className="mt-6 p-4 bg-gray-200 rounded-xl">
            <p className="text-sm text-black mb-2">Personal Meeting ID</p>
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#E9164B]">
                {user.meetingId}
              </span>
              <button onClick={copyMeetingId}>
                <Copy className="w-4 h-4 text-[#E9164B]" />
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="lg:col-span-2 bg-gray-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>

          <div className="space-y-4">
            {/* Meeting Item */}
            <div className="flex items-center justify-between p-4 bg-gray-200 rounded-xl">
              <div>
                <p className="font-medium">UI/UX Discussion</p>
                <p className="text-sm text-[#E9164B]">Today • 3:00 PM</p>
              </div>
              <button className="px-4 py-2 bg-[#E9164B] text-white rounded-lg text-sm">
                Join
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-200 rounded-xl">
              <div>
                <p className="font-medium">Team Standup</p>
                <p className="text-sm text-[#E9164B]">Tomorrow • 10:00 AM</p>
              </div>
              <button className="px-4 py-2 bg-[#E9164B] rounded-lg text-sm text-white">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-gray-100 rounded-2xl border border-white/10">
          <Clock className="mb-2 text-[#E9164B]" />
          <h3 className="text-xl font-bold">48h</h3>
          <p className="text-sm text-[#E9164B]">Meeting Time</p>
        </div>

        <div className="p-6 bg-gray-100 rounded-2xl border border-white/10">
          <Users className="mb-2 text-[#E9164B]" />
          <h3 className="text-xl font-bold">120</h3>
          <p className="text-sm text-[#E9164B]">Participants</p>
        </div>

        <div className="p-6 bg-gray-100 rounded-2xl border border-white/10">
          <Video className="mb-2 text-[#E9164B]" />
          <h3 className="text-xl font-bold">32</h3>
          <p className="text-sm text-[#E9164B]">Meetings</p>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
