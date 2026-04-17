"use client";
import React, { useEffect, useState } from "react";
import {
  FileText,
  Star,
  Trash2,
  Share2,
  Clock,
  Folder,
  Plus,
} from "lucide-react";
import { getTokenData } from "@/app/content/data";

const NotesPage = () => {
  const [mode, setMode] = useState("modern"); // modern | classic
  const [activeTab, setActiveTab] = useState("mynotes");
  const [activeSidebar, setActiveSidebar] = useState("all");
  const [decodedUser, setDecodedUser] = useState([]);

  const[notes,setNotes] = useState(null);
  const [groupedNotes, setGroupedNotes] = useState({});
  const groupByMeeting = (notes) => {
  return notes.reduce((acc, note) => {
    const id = note.meetingId;

    if (!acc[id]) {
      acc[id] = [];
    }

    acc[id].push(note);

    return acc;
  }, {});
};
  //  const fetchNotes = async (userId) => {
  //   try{
  //    const res = await fetch(`/api/user/notes?userId=${userId}`,{
  //       method : "GET",
  //       headers : {
  //         "Content-Type" : "application/json",
  //       },
  //     })

  //     let data = await res.json();
     
  //       console.log("Notes:", data);
        
  //     // const upcomingMeetings = data?.meetings?.filter(meeting => meeting.upcoming === true);
  //     // setMeetingData(upcomingMeetings);
  //     // console.log("Filtered Upcoming Meetings:", upcomingMeetings);
  //   }catch(error){
  //     console.log("Error fetching upcoming meetings:", error);
  //   }
            
  //         }

  const fetchNotes = async (userId) => {
  try {
    const res = await fetch(
      `/api/user/notes?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    console.log("Notes:", data);

    const grouped = groupByMeeting(data.data);
    console.log("Grouped Notes:", grouped);
    setGroupedNotes(grouped);

  } catch (error) {
    console.log("Error fetching notes:", error);
  }
};


  useEffect(() => {
    let userId;
      getTokenData()
        .then((user) => {
          console.log("Decoded User:", user);
          setDecodedUser(user || {});
          userId = user?.id; // Extract userId from decoded user data
          console.log("Extracted userId:", userId);
          // setLoading(false);
                  fetchNotes(userId);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // setLoading(false);
        });

    }, []);
  const notesData = [
    {
      title: "Meeting Notes - UI Review",
      date: "Today",
      starred: true,
    },
    {
      title: "Project Planning",
      date: "Yesterday",
      starred: false,
    },
  ];

  const sidebarItems = [
    { key: "all", label: "All Notes", icon: FileText },
    { key: "recent", label: "Recent", icon: Clock },
    { key: "mynotes", label: "My Notes", icon: FileText },
    { key: "starred", label: "Starred", icon: Star },
    { key: "shared", label: "Shared with Me", icon: Share2 },
    { key: "trash", label: "Trash", icon: Trash2 },
    { key: "projects", label: "Projects", icon: Folder },
  ];

  return (
    <div className="min-h-screen bg-[#EAEAF4] text-white p-6">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-black font-bold">Notes</h1>
          <p className="text-[#E9164B] text-sm">
            Manage your notes and ideas
          </p>
        </div>

        {/* Mode Switch */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("modern")}
            className={`px-4 py-2 rounded-lg text-sm ${
              mode === "modern"
                ? "bg-[#E9164B]"
                : "bg-white/5 border border-[#E51A54] text-[#E51A54] cursor-pointer hover:bg-[#E51A54] hover:text-white"
            }`}
          >
            My Notes
          </button>
          <button
            onClick={() => setMode("classic")}
            className={`px-4 py-2 rounded-lg text-sm ${
              mode === "classic"
                ? "bg-[#E9164B]"
                : "bg-white/5 border border-[#E51A54] text-[#E51A54] cursor-pointer hover:bg-[#E51A54] hover:text-white"
            }`}
          >
            Classic
          </button>
        </div>
      </div>

      {/* ================= MODERN VIEW ================= */}
      {mode === "modern" && (
        <>
          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            {["mynotes", "shared", "starred", "trash"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  activeTab === tab
                    ? "bg-[#E9164B]"
                    : "bg-white/5 cursor-pointer border border-[#E51A54] text-[#E51A54] hover:bg-[#E51A54] hover:text-white"
                }`}
              >
                {tab === "mynotes" && "My Notes"}
                {tab === "shared" && "Shared with Me"}
                {tab === "starred" && "Starred"}
                {tab === "trash" && "Trash"}
              </button>
            ))}
          </div>

          {/* Notes Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Add Note */}
            <div className="p-6 bg-white rounded-2xl border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition">
              <Plus className="mb-2 text-[#E9164B]" />
              <p className="text-sm text-[#E9164B]">New Note</p>
            </div>

            {notesData.map((note, index) => (
              <div
                key={index}
                className="p-5 bg-white rounded-2xl border border-white/10 transition"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{note.title}</h3>
                  {note.starred && (
                    <Star className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {note.date}
                </p>

                <div className="flex gap-2 mt-4">
                  <button className="text-xs px-3 py-1 bg-[#E9164B] rounded-lg">
                    Open
                  </button>
                  <button className="text-xs px-3 py-1 bg-[#EAEAF4] text-gray-600 rounded-lg">
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= CLASSIC VIEW ================= */}
      {mode === "classic" && (
        <div className="flex gap-6">
          
          {/* Sidebar */}
          <div className="w-64 bg-white border border-white/10 rounded-2xl p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveSidebar(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-2 ${
                    activeSidebar === item.key
                      ? "bg-[#E9164B]"
                      : "text-gray-600 cursor-pointer transition hover:text-white hover:bg-[#E51A54]  "
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Notes List */}
          {/* <div className="flex-1 bg-white border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg text-gray-800 font-semibold mb-4">
              {activeSidebar.toUpperCase()}
            </h2>

            {notesData.length === 0 ? (
              <p className="text-gray-600">No notes found</p>
            ) : (
              <div className="space-y-4">
                {notesData.map((note, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#EAEAF4] rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-600">{note.title}</p>
                      <p className="text-sm text-gray-500">
                        {note.date}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs bg-[#E9164B] rounded-lg">
                        Open
                      </button>
                      <button className="px-3 py-1 text-xs bg-white/10 text-gray-600 rounded-lg">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}
          
        </div>
      )}
    </div>
  );
};

export default NotesPage;