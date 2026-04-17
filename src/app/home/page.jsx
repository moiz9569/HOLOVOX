"use client";
import React from "react";
import { Video, Users, Calendar, Clock, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { getTokenData } from "../content/data";
import { Podcast } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { showErrorToast, showSuccessToast } from "../../../lib/toast";
// import { showSuccessToast, showErrorToast } from "../../lib/toast";
const HomeDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [decodedUser, setDecodedUser] = useState([]);
  const [meetingId, setMeetingId] = useState("");
  const [showFeatures, setShowFeatures] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const[meetingData,setMeetingData] = useState(null);
   const fetchUpcomingMeetings = async () => {
    try{
     const res = await fetch("/api/user/meeting",{
        method : "GET",
        headers : {
          "Content-Type" : "application/json",
        },
      })

      let data = await res.json();
     
        console.log("Upcoming Meetings:", data.meetings);
        
      const upcomingMeetings = data?.meetings?.filter(meeting => meeting.upcoming === true);
      setMeetingData(upcomingMeetings);
      console.log("Filtered Upcoming Meetings:", upcomingMeetings);
    }catch(error){
      console.log("Error fetching upcoming meetings:", error);
    }
            
          }

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
      fetchUpcomingMeetings();
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
  //Calender
   const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    meetingTitle: "",
  });
  const scheduleMeeting = async (e) => {
                e.preventDefault();

            // console.log({
            //   ...formData,
            //   date: selectedDate,
            // });
             const id = uuidv4().slice(0, 6);
            const {meetingTitle,time } = formData;
            console.log("Scheduling Meeting with data:",  decodedUser?.id,decodedUser.name, decodedUser?.email, meetingTitle, selectedDate,id ,time);
            fetch("/api/user/meeting", {
              method: "POST",
              headers: {  
              "Content-Type": "application/json",
              },
              body: JSON.stringify({
                hostId: decodedUser?.id,
                name: decodedUser.name,
                email: decodedUser?.email,
                meetingTitle,
                date: selectedDate,
                meetingId : id,
                time: time,
                upcoming: true,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Meeting scheduled successfully:", data);
                showSuccessToast("Meeting Scheduled Successfully!");
              })
              .catch((error) => {
                console.error("Error scheduling meeting:", error);
                showErrorToast("Failed to schedule meeting");
              });

            // alert("Meeting Scheduled ✅");

            // reset
            setShowCalendar(false);
            setShowForm(false);
            setFormData({
              name: "",
              email: "",
              meetingTitle: "",
            })
          }

const getMeetingStatus = (meeting) => {
  const meetingDateTime = new Date(
    `${meeting.meetingDate.split("T")[0]} ${meeting.time}`
  );

  const now = new Date();

  const diff = now - meetingDateTime; // ms difference
  const oneHour = 60 * 60 * 1000;

  if (diff < 0) {
    return "upcoming";
  } else if (diff >= 0 && diff <= oneHour) {
    return "join";
  } else {
    return "passes";
  }
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

        <div onClick={() => setShowCalendar(true)} className="cursor-pointer p-6 rounded-2xl bg-[#E51A54] text-white hover:scale-105 transition">
          <Calendar className="mb-4" />
          <h3 className="font-semibold text-white text-base">Schedule</h3>
          <p className="text-sm text-white">Plan your meetings</p>
        </div>
        {showCalendar && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-[350px] relative">

      {/* Close Button */}
      <button
        onClick={() => {
          setShowCalendar(false);
          setShowForm(false);
        }}
        className="absolute top-2 right-3 text-gray-500"
      >
        ✕
      </button>

    {/* Calendar + Time */}
{!showForm && (
  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-4">

    {/* Heading */}
    <div className="text-center">
      <h3 className="text-xl font-bold text-[#E51A54]">
        Select Date & Time
      </h3>
      <p className="text-sm text-gray-500">
        Choose when your meeting will start
      </p>
    </div>

    {/* Date Input */}
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">Date</label>
      <input
        type="date"
        className="w-full border border-gray-200 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>

    {/* Time Input */}
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">Time</label>
      <input
        type="time"
        className="w-full border border-gray-200 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
        onChange={(e) =>
          setFormData({
            ...formData,
            time: e.target.value,
          })
        }
      />
    </div>

    {/* Continue Button */}
    <button
      onClick={() => {
        if (!selectedDate || !formData.time) {
          alert("Please select date & time");
          return;
        }
        setShowForm(true);
      }}
      className="bg-[#E51A54] hover:bg-[#c91548] text-white p-3 rounded-xl font-semibold transition"
    >
      Continue →
    </button>
  </div>
)}

      {/* Form */}
      {/* {showForm && (
        <form
          onSubmit={(e) => {scheduleMeeting(e)}}
          className="flex flex-col gap-3"
        >
          <h3 className="text-lg font-semibold">Meeting Details</h3>


          <input
            type="text"
            placeholder="Meeting Title"
            className="border p-2 rounded"
            onChange={(e) =>
              setFormData({
                ...formData,
                meetingTitle: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="bg-[#E51A54] text-white p-2 rounded"
          >
            Schedule
          </button>
        </form>
      )} */}
      {showForm && (
  <form
    onSubmit={(e) => scheduleMeeting(e)}
    className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
  >
    {/* Heading */}
    <div className="text-center">
      <h3 className="text-xl font-bold text-[#E51A54]">
        Schedule Meeting
      </h3>
      <p className="text-sm text-gray-500">
        Add your meeting details below
      </p>
    </div>

    {/* Input */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Meeting Title
      </label>
      <input
        type="text"
        placeholder="Enter meeting title..."
        className="border border-gray-200 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
        onChange={(e) =>
          setFormData({
            ...formData,
            meetingTitle: e.target.value,
          })
        }
      />
    </div>

    {/* Date Preview */}
    {selectedDate && (
      <div className="bg-[#E51A54]/10 text-[#E51A54] text-sm p-3 rounded-lg text-center">
        📅 Scheduled for: <span className="font-semibold">{selectedDate}</span>
      </div>
    )}

    {/* Button */}
    <button
      type="submit"
      className="bg-[#E51A54] hover:bg-[#c91548] text-white p-3 rounded-xl font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
    >
      Schedule Meeting 🚀
    </button>
  </form>
)}
    </div>
  </div>
)}

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
        {/* <div className="lg:col-span-2 bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>

          <div className="space-y-4">
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
        </div> */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6">
  <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>

  <div className="space-y-4">
  {meetingData?.length > 0 ? (
    meetingData.map((meeting) => {
      // 🔥 STATUS LOGIC (A to Z)
      const meetingDateTime = new Date(meeting.meetingDate);
      const [h, m] = meeting.time.split(":");

      meetingDateTime.setHours(h);
      meetingDateTime.setMinutes(m);

      const now = new Date();
      const diff = now - meetingDateTime;
      const oneHour = 60 * 60 * 1000;

      let status = "";

      if (diff < 0) status = "upcoming";
      else if (diff >= 0 && diff <= oneHour) status = "join";
      else status = "passes";

      return (
        <div
          key={meeting._id}
          className="p-4 bg-[#EAEAF4] rounded-xl flex flex-col gap-2 hover:shadow-md transition"
        >
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                {meeting.meetingTitle}
              </p>

              <p className="text-sm text-[#E51A54]">
                {meeting.time}
              </p>
            </div>

            {/* STATUS BADGE */}
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full
                ${
                  status === "upcoming"
                    ? "bg-blue-100 text-blue-600"
                    : status === "join"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }
              `}
            >
              {status === "upcoming"
                ? "Upcoming"
                : status === "join"
                ? "Join"
                : "Passes"}
            </span>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              📅 {new Date(meeting.meetingDate).toDateString()}
            </div>

            {/* JOIN BUTTON (only if active) */}
            {status === "join" && (
              <button className="px-4 py-2 bg-[#E51A54] text-white rounded-lg text-sm hover:scale-105 transition">
                Join
              </button>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-gray-500 text-sm">
      No upcoming meetings found
    </p>
  )}
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
