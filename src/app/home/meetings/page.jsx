// "use client";
// import React, { useState,useEffect } from "react";
// import { Calendar, Video, Users, Copy } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import { showSuccessToast,showErrorToast } from "../../../../lib/toast";
// import { getTokenData } from "@/app/content/data";

// const MeetingsPage = () => {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("upcoming");
//   const [showCalendar, setShowCalendar] = useState(false);
//    const [meetingId, setMeetingId] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [decodedUser, setDecodedUser] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     meetingTitle: "",
//   });


//  const [meetingData, setMeetingData] = useState(null);
//   const fetchUpcomingMeetings = async () => {
//     try {
//       const res = await fetch("/api/user/meeting", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       let data = await res.json();

//       console.log("Upcoming Meetings:", data.meetings);

//       const upcomingMeetings = data?.meetings?.filter(
//         (meeting) => meeting.upcoming === true,
//       );
//       setMeetingData(upcomingMeetings);
//       console.log("Filtered Upcoming Meetings:", upcomingMeetings);
//     } catch (error) {
//       console.log("Error fetching upcoming meetings:", error);
//     }
//   };

//    useEffect(() => {
//       const handleClickOutside = () => setShowFeatures(false);
//       document.addEventListener("click", handleClickOutside);
//       return () => document.removeEventListener("click", handleClickOutside);
//     }, []);

//     useEffect(() => {
//         getTokenData()
//           .then((user) => {
//             console.log("Decoded User:", user);
//             setDecodedUser(user || {});
//             setLoading(false);
//           })
//           .catch((error) => {
//             console.error("Error fetching user data:", error);
//             setLoading(false);
//           });
//         fetchUpcomingMeetings();
//         // fetchUser();
//       }, []);

//   const scheduleMeeting = async (e) => {
//     e.preventDefault();
//     const id = uuidv4().slice(0, 6);
//     const { meetingTitle, time } = formData;
//     console.log(
//       "Scheduling Meeting with data:",
//       decodedUser?.id,
//       decodedUser.name,
//       decodedUser?.email,
//       meetingTitle,
//       selectedDate,
//       id,
//       time,
//     );
//     fetch("/api/user/meeting", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         hostId: decodedUser?.id,
//         name: decodedUser.name,
//         email: decodedUser?.email,
//         meetingTitle,
//         date: selectedDate,
//         meetingId: id,
//         time: time,
//         upcoming: true,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Meeting scheduled successfully:", data);
//         showSuccessToast("Meeting Scheduled Successfully!");
//       })
//       .catch((error) => {
//         console.error("Error scheduling meeting:", error);
//         showErrorToast("Failed to schedule meeting");
//       });

//     // alert("Meeting Scheduled ✅");

//     // reset
//     setShowCalendar(false);
//     setShowForm(false);
//     setFormData({
//       name: "",
//       email: "",
//       meetingTitle: "",
//     });
//   };

//     const user = {
//     name: decodedUser?.name,
//     email: decodedUser?.email,
//     avatar: decodedUser?.image,
//     meetingId: meetingId,
//   };

//   const userId = {
//     meetingId: "123-456-789",
//   };

//   const createMeeting = () => {
//     const id = uuidv4().slice(0, 6);
//     router.push(`/meeting/${id}?role=host`);
//   };

//   const copyMeetingId = () => {
//     navigator.clipboard.writeText(userId.meetingId);
//     showSuccessToast("Meeting ID copied to clipboard!");
//   };

//   const upcomingMeetings = [
//     {
//       title: "UI/UX Review",
//       date: "Today",
//       time: "3:00 PM",
//     },
//     {
//       title: "Team Standup",
//       date: "Tomorrow",
//       time: "10:00 AM",
//     },
//   ];

//   const previousMeetings = [
//     {
//       title: "Client Meeting",
//       date: "Yesterday",
//       duration: "45 min",
//     },
//     {
//       title: "Design Discussion",
//       date: "2 days ago",
//       duration: "30 min",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#EAEAF4] text-white p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-black">Meetings</h1>
//         <p className="text-[#E9164B] text-sm">
//           Manage and schedule your meetings
//         </p>
//       </div>

//       {/* Top Actions */}
//       <div className="grid md:grid-cols-3 gap-6 mb-8">
//         {/* Schedule */}
//         <div className="p-6 bg-white text-black rounded-2xl border border-white/10">
//           <Calendar className="mb-3 text-[#E9164B]" />
//           <h3 className="font-semibold">Schedule Meeting</h3>
//           <p className="text-sm text-gray-600 mb-4">Plan a meeting for later</p>
//           <button
//             onClick={() => setShowCalendar(true)}
//             className="px-4 cursor-pointer py-2 bg-[#E9164B] text-white rounded-lg text-sm"
//           >
//             Schedule
//           </button>
//         </div>
//         {showCalendar && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-2xl w-[350px] relative">
//               {/* Close Button */}
//               <button
//                 onClick={() => {
//                   setShowCalendar(false);
//                   setShowForm(false);
//                 }}
//                 className="absolute top-2 right-3 text-gray-500"
//               >
//                 ✕
//               </button>

//               {/* Calendar + Time */}
//               {!showForm && (
//                 <div className="bg-white p-6 flex flex-col gap-4">
//                   {/* Heading */}
//                   <div className="text-center">
//                     <h3 className="text-xl font-bold text-[#E51A54]">
//                       Select Date & Time
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       Choose when your meeting will start
//                     </p>
//                   </div>

//                   {/* Date Input */}
//                   <div className="flex flex-col gap-2">
//                     <label className="text-sm text-gray-600">Date</label>
//                     <input
//                       type="date"
//                       className="w-full text-black border border-gray-200 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
//                       onChange={(e) => setSelectedDate(e.target.value)}
//                     />
//                   </div>

//                   {/* Time Input */}
//                   <div className="flex flex-col gap-2">
//                     <label className="text-sm text-gray-600">Time</label>
//                     <input
//                       type="time"
//                       className="w-full text-black border border-gray-200 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           time: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   {/* Continue Button */}
//                   <button
//                     onClick={() => {
//                       if (!selectedDate || !formData.time) {
//                         showErrorToast("Please select date & time");
//                         return;
//                       }
//                       setShowForm(true);
//                     }}
//                     className="bg-[#E51A54] hover:bg-[#c91548] text-white p-3 rounded-xl font-semibold transition"
//                   >
//                     Continue →
//                   </button>
//                 </div>
//               )}
//               {showForm && (
//                 <form
//                   onSubmit={(e) => scheduleMeeting(e)}
//                   className="flex flex-col gap-4 bg-white p-6"
//                 >
//                   {/* Heading */}
//                   <div className="text-center">
//                     <h3 className="text-xl font-bold text-[#E51A54]">
//                       Schedule Meeting
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       Add your meeting details below
//                     </p>
//                   </div>

//                   {/* Input */}
//                   <div className="flex flex-col gap-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       Meeting Title
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter meeting title..."
//                       className="border text-gray-600 border-gray-200 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           meetingTitle: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   {/* Date Preview */}
//                   {selectedDate && (
//                     <div className="bg-[#E51A54]/10 text-[#E51A54] text-sm p-3 rounded-lg text-center">
//                       📅 Scheduled for:{" "}
//                       <span className="font-semibold">{selectedDate}</span>
//                     </div>
//                   )}

//                   {/* Button */}
//                   <button
//                     type="submit"
//                     className="bg-[#E51A54] cursor-pointer hover:bg-[#c91548] text-white p-3 rounded-xl font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
//                   >
//                     Schedule Meeting
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Instant */}
//         <div
//           onClick={createMeeting}
//           className="p-6 bg-[#E9164B] rounded-2xl cursor-pointer hover:scale-105 transition"
//         >
//           <Video className="mb-3" />
//           <h3 className="font-semibold">Start Instant Meeting</h3>
//           <p className="text-sm opacity-80">Start meeting right now</p>
//         </div>

//         {/* Personal Room */}
//         <div className="p-6 bg-white rounded-2xl border border-white/10">
//           <Users className="mb-3 text-[#E9164B]" />
//           <h3 className="font-semibold text-black">Personal Room</h3>
//           <p className="text-sm text-gray-600 mb-3">
//             Always available meeting room
//           </p>

//           <div className="flex items-center justify-between bg-[#EAEAF4] p-2 rounded-lg">
//             <span className="text-sm text-gray-800">{user.meetingId}</span>
//             <button className="cursor-pointer" onClick={copyMeetingId}>
//               <Copy className="w-4 h-4 text-[#E9164B]" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         {["upcoming", "previous"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-lg text-sm ${
//               activeTab === tab
//                 ? "bg-[#E9164B]"
//                 : "bg-white/5 hover:bg-white/10 text-[#E51A54] cursor-pointer"
//             }`}
//           >
//             {tab === "upcoming" ? "Upcoming" : "Previous"}
//           </button>
//         ))}
//       </div>

//       {/* Meetings List */}
//       <div className="rounded-2xl border border-white/10">
//         {/* Upcoming */}
//         {activeTab === "upcoming" && (
//           <div className="space-y-4">
//             {upcomingMeetings.map((meeting, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between bg-white rounded-xl p-4"
//               >
//                 <div>
//                   <p className="font-medium text-black">{meeting.title}</p>
//                   <p className="text-sm text-gray-600">
//                     {meeting.date} • {meeting.time}
//                   </p>
//                 </div>

//                 {/* <button className="px-4 py-2 bg-[#E9164B] cursor-pointer rounded-lg text-sm">
//                   Join
//                 </button> */}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Previous */}
//         {activeTab === "previous" && (
//           <div className="space-y-4">
//             {previousMeetings.map((meeting, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-4 bg-white rounded-xl"
//               >
//                 <div>
//                   <p className="font-medium text-black">{meeting.title}</p>
//                   <p className="text-sm text-gray-600">
//                     {meeting.date} • {meeting.duration}
//                   </p>
//                 </div>

//                 <button className="px-4 py-2 bg-white/10 rounded-lg text-sm">
//                   Details
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Empty State (optional future use) */}
//       {/* You can show when no meetings */}
//     </div>
//   );
// };

// export default MeetingsPage;












"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Video, Users, Copy, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getTokenData } from "@/app/content/data";
import { showSuccessToast,showErrorToast } from "../../../../lib/toast";

const toMeetingDateTime = (meeting) => {
  const base = new Date(meeting?.meetingDate || Date.now());
  if (Number.isNaN(base.getTime())) return new Date();

  const value = `${meeting?.time || ""}`.trim();
  let hours = 0;
  let minutes = 0;

  const ampmMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const hhmmMatch = value.match(/^(\d{1,2}):(\d{2})$/);

  if (ampmMatch) {
    const rawHours = parseInt(ampmMatch[1], 10);
    minutes = parseInt(ampmMatch[2], 10);
    const period = ampmMatch[3].toUpperCase();
    hours = rawHours % 12;
    if (period === "PM") hours += 12;
  } else if (hhmmMatch) {
    hours = parseInt(hhmmMatch[1], 10);
    minutes = parseInt(hhmmMatch[2], 10);
  }

  const dateTime = new Date(base);
  dateTime.setHours(hours, minutes, 0, 0);
  return dateTime;
};

export default function MeetingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");

  const [decodedUser, setDecodedUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isJoiningId, setIsJoiningId] = useState("");
  const [error, setError] = useState("");

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showScheduleDetailsForm, setShowScheduleDetailsForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    meetingTitle: "",
    date: "",
    time: "",
  });

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setShowScheduleDetailsForm(false);
    setScheduleData({ meetingTitle: "", date: "", time: "" });
  };

  const personalMeetingId = useMemo(() => {
    if (!decodedUser?.id) return "Not available";
    return `${decodedUser.id}`.slice(-12);
  }, [decodedUser]);

  const fetchMeetings = async (user) => {
    try {
      setIsFetching(true);
      setError("");

      const res = await fetch("/api/user/meeting");
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to fetch meetings");
      }

      const allMeetings = Array.isArray(data.meetings) ? data.meetings : [];
      const email = (user?.email || "").toLowerCase();

      const myMeetings = allMeetings.filter((meeting) =>
        Array.isArray(meeting?.participants)
          ? meeting.participants.some(
              (p) => (p?.email || "").toLowerCase() === email
            )
          : false
      );

      setMeetings(myMeetings);
    } catch (err) {
      console.error("Fetch meetings error:", err);
      setError(err?.message || "Failed to fetch meetings");
      showErrorToast(err?.message || "Failed to fetch meetings");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const user = await getTokenData();
        if (!mounted) return;

        if (!user?.id || !user?.email || !user?.name) {
          setError("Please login to manage meetings.");
          return;
        }

        setDecodedUser(user);
        await fetchMeetings(user);
      } catch (err) {
        console.error("Bootstrap meetings error:", err);
        if (mounted) {
          setError("Unable to initialize meetings.");
        }
      } finally {
        if (mounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const createMeeting = async () => {
    if (!decodedUser?.id || !decodedUser?.email || !decodedUser?.name) {
      showErrorToast("User info missing. Please login again.");
      return;
    }

    const id = uuidv4().slice(0, 6);

    try {
      setIsCreating(true);

      const res = await fetch("/api/user/meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostId: decodedUser.id,
          name: decodedUser.name,
          email: decodedUser.email,
          meetingId: id,
          meetingTitle: "Instant Meeting",
          date: new Date().toISOString(),
          upcoming: false,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || data?.error || "Failed to create meeting");
      }

      showSuccessToast("Instant meeting started");
      router.push(`/meeting-room/${id}?role=host`);
    } catch (err) {
      console.error("Create meeting error:", err);
      showErrorToast(err?.message || "Failed to create meeting");
    } finally {
      setIsCreating(false);
    }
  };

  const scheduleMeeting = async () => {
    if (!decodedUser?.id || !decodedUser?.email || !decodedUser?.name) {
      showErrorToast("User info missing. Please login again.");
      return;
    }

    if (!scheduleData.meetingTitle.trim() || !scheduleData.date || !scheduleData.time) {
      showErrorToast("Title, date and time are required");
      return;
    }

    const id = uuidv4().slice(0, 6);

    try {
      setIsScheduling(true);

      const res = await fetch("/api/user/meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostId: decodedUser.id,
          name: decodedUser.name,
          email: decodedUser.email,
          meetingId: id,
          meetingTitle: scheduleData.meetingTitle.trim(),
          date: scheduleData.date,
          time: scheduleData.time,
          upcoming: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || data?.error || "Failed to schedule meeting");
      }

      showSuccessToast("Meeting scheduled successfully");
      setShowScheduleModal(false);
      setShowScheduleDetailsForm(false);
      setScheduleData({ meetingTitle: "", date: "", time: "" });
      await fetchMeetings(decodedUser);
    } catch (err) {
      console.error("Schedule meeting error:", err);
      showErrorToast(err?.message || "Failed to schedule meeting");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleJoinMeeting = async (meeting) => {
    if (!decodedUser?.id || !decodedUser?.name || !decodedUser?.email) {
      showErrorToast("Please login first");
      return;
    }

    try {
      setIsJoiningId(meeting._id);

      const alreadyJoined = Array.isArray(meeting.participants)
        ? meeting.participants.some((p) => p?.userId === decodedUser.id)
        : false;

      if (!alreadyJoined) {
        await fetch("/api/user/meeting", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: decodedUser.id,
            meetingId: meeting.meetingId,
            name: decodedUser.name,
            email: decodedUser.email,
          }),
        });
      }

      router.push(`/meeting-room/${meeting.meetingId}?role=guest`);
    } catch (err) {
      console.error("Join meeting error:", err);
      showErrorToast("Failed to join meeting");
    } finally {
      setIsJoiningId("");
    }
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(personalMeetingId);
    showSuccessToast("Meeting ID copied");
  };

  const { upcomingMeetings, previousMeetings } = useMemo(() => {
    const now = new Date();

    const enriched = meetings.map((meeting) => ({
      ...meeting,
      meetingDateTime: toMeetingDateTime(meeting),
    }));

    const upcoming = enriched
      .filter((m) => m.meetingDateTime >= now)
      .sort((a, b) => a.meetingDateTime - b.meetingDateTime);

    const previous = enriched
      .filter((m) => m.meetingDateTime < now)
      .sort((a, b) => b.meetingDateTime - a.meetingDateTime);

    return {
      upcomingMeetings: upcoming,
      previousMeetings: previous,
    };
  }, [meetings]);

  return (
    <div className="min-h-screen bg-[#EAEAF4] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Meetings</h1>
        <p className="text-[#E9164B] text-sm">Manage and schedule your meetings</p>
      </div>

      {(isBootstrapping || isFetching) && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin text-[#E9164B]" />
          Loading meetings...
        </div>
      )}

      {error && !isBootstrapping && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white text-black rounded-2xl border border-white/10">
          <Calendar className="mb-3 text-[#E9164B]" />
          <h3 className="font-semibold">Schedule Meeting</h3>
          <p className="text-sm text-gray-600 mb-4">Plan a meeting for later</p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-[#E9164B] text-white rounded-lg text-sm cursor-pointer hover:bg-[#c91442]"
          >
            Schedule
          </button>
        </div>

        <button
          onClick={createMeeting}
          disabled={isCreating}
          className="p-6 bg-[#E9164B] rounded-2xl cursor-pointer hover:scale-[1.02] transition text-white text-left disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <Loader2 className="mb-3 w-6 h-6 animate-spin" />
          ) : (
            <Video className="mb-3" />
          )}
          <h3 className="font-semibold">Start Instant Meeting</h3>
          <p className="text-sm opacity-80">Start meeting right now</p>
        </button>

        <div className="p-6 bg-white rounded-2xl border border-white/10">
          <Users className="mb-3 text-[#E9164B]" />
          <h3 className="font-semibold text-black">Personal Room</h3>
          <p className="text-sm text-gray-600 mb-3">Always available meeting room</p>

          <div className="flex items-center justify-between bg-[#EAEAF4] p-2 rounded-lg">
            <span className="text-sm text-gray-800">{personalMeetingId}</span>
            <button className="cursor-pointer" onClick={copyMeetingId}>
              <Copy className="w-4 h-4 text-[#E9164B]" />
            </button>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[350px] relative">
            <button
              onClick={closeScheduleModal}
              className="absolute top-2 right-3 text-gray-500 cursor-pointer"
              disabled={isScheduling}
            >
              ✕
            </button>

            {!showScheduleDetailsForm && (
              <div className="bg-white p-6 rounded-2xl flex flex-col gap-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#E51A54]">Select Date & Time</h3>
                  <p className="text-sm text-gray-500">Choose when your meeting will start</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">Date</label>
                  <input
                    type="date"
                    value={scheduleData.date}
                    className="w-full text-gray-600 border border-gray-200 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
                    onChange={(e) =>
                      setScheduleData((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">Time</label>
                  <input
                    type="time"
                    value={scheduleData.time}
                    className="w-full text-gray-600 border border-gray-200 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
                    onChange={(e) =>
                      setScheduleData((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>

                <button
                  onClick={() => setShowScheduleDetailsForm(true)}
                  disabled={!scheduleData.date || !scheduleData.time}
                  className="bg-[#E51A54] hover:bg-[#c91548] disabled:opacity-60 disabled:cursor-not-allowed text-white p-3 rounded-xl font-semibold transition"
                >
                  Continue →
                </button>
              </div>
            )}

            {showScheduleDetailsForm && (
              <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#E51A54]">Schedule Meeting</h3>
                  <p className="text-sm text-gray-500">Add your meeting details below</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Meeting Title</label>
                  <input
                    type="text"
                    placeholder="Enter meeting title..."
                    value={scheduleData.meetingTitle}
                    className="border border-gray-200 text-gray-600 focus:border-[#E51A54] focus:ring-2 focus:ring-[#E51A54]/20 p-3 rounded-xl outline-none transition"
                    onChange={(e) =>
                      setScheduleData((prev) => ({ ...prev, meetingTitle: e.target.value }))
                    }
                  />
                </div>

                {scheduleData.date && (
                  <div className="bg-[#E51A54]/10 text-[#E51A54] text-sm p-3 rounded-lg text-center">
                    Scheduled for: <span className="font-semibold">{scheduleData.date}</span>
                  </div>
                )}

                <button
                  onClick={scheduleMeeting}
                  disabled={isScheduling || !scheduleData.meetingTitle.trim()}
                  className="bg-[#E51A54] hover:bg-[#c91548] disabled:opacity-70 disabled:cursor-not-allowed text-white p-3 rounded-xl font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
                >
                  {isScheduling ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Meeting"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        {["upcoming", "previous"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === tab
                ? "bg-[#E9164B] text-white"
                : "bg-white border border-[#E51A54] hover:bg-[#E51A54] hover:text-white text-[#E51A54] cursor-pointer"
            }`}
          >
            {tab === "upcoming" ? "Upcoming" : "Previous"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10">
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {upcomingMeetings.length === 0 ? (
              <div className="bg-white rounded-xl p-4 text-sm text-gray-500">No upcoming meetings</div>
            ) : (
              upcomingMeetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between bg-white rounded-xl p-4"
                >
                  <div>
                    <p className="font-medium text-black">{meeting.meetingTitle || "Untitled Meeting"}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(meeting.meetingDate).toLocaleDateString()} • {meeting.time || "00:00"}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 text-xs font-medium">
                        Upcoming
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinMeeting(meeting)}
                    disabled={isJoiningId === meeting._id}
                    className="px-4 py-2 bg-[#E9164B] cursor-pointer rounded-lg text-sm text-white disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isJoiningId === meeting._id && <Loader2 className="w-4 h-4 animate-spin" />}
                    Join
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "previous" && (
          <div className="space-y-4">
            {previousMeetings.length === 0 ? (
              <div className="bg-white rounded-xl p-4 text-sm text-gray-500">No previous meetings</div>
            ) : (
              previousMeetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between p-4 bg-white rounded-xl"
                >
                  <div>
                    <p className="font-medium text-black">{meeting.meetingTitle || "Untitled Meeting"}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(meeting.meetingDate).toLocaleDateString()} • {meeting.time || "00:00"}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-gray-200 text-gray-700 px-2.5 py-1 text-xs font-medium">
                        Passed
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinMeeting(meeting)}
                    disabled={isJoiningId === meeting._id}
                    className="px-4 py-2 bg-[#E9164B] rounded-lg text-sm text-white disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isJoiningId === meeting._id && <Loader2 className="w-4 h-4 animate-spin" />}
                    Open
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
