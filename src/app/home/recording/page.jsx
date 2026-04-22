"use client";
import React, { useEffect, useState } from "react";
import {
  Video,
  Cloud,
  HardDrive,
  Share2,
  Trash2,
  Play,
  Download,
} from "lucide-react";
import { getTokenData } from "@/app/content/data";

const RecordingsPage = () => {
  const [activeTab, setActiveTab] = useState("cloud");
  const [userId, setUserId] = useState("");
  const [Recordings, setRecordings] = useState([]);
  const tabs = [
    { key: "cloud", label: "Cloud Recordings", icon: Cloud },
    { key: "local", label: "Computer Recordings", icon: HardDrive },
    { key: "shared", label: "Shared with Me", icon: Share2 },
    { key: "trash", label: "Trash", icon: Trash2 },
  ];

  useEffect(() => {
    getTokenData().then((data) => {
      console.log("Decoded token data:", data.id);
      setUserId(data.id);
    });
    const fetchData = async () => {
      console.log("Fetching recordings for userId:", userId);
      const res = await fetch(`/api/user/upload-recording?userId=${userId}`);

      const data = await res.json();
      console.log("Fetched Recordings:", data);
      if (data.success) {
        setRecordings(data.data);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;
    fetch(`/api/user/upload-recording?recordingId=${id}`, {
      method: "DELETE",
    });
    console.log("Delete clicked, recordingId:", id);
  };

  return (
    <div className="min-h-screen bg-[#EAEAF4] p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recordings</h1>
        <p className="text-[#E51A54] text-sm mt-1">
          Manage your meeting recordings
        </p>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-[#E51A54] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-[#E51A54] hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {Recordings.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <Video className="w-14 h-14 text-gray-300 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">
            No recordings found
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Your meeting recordings will appear here
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Recordings.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              {/* VIDEO */}
              <div className="relative group">
                <video
                  src={rec.videoUrl}
                  controls
                  className="w-full h-48 object-cover"
                />

                {/* PLAY OVERLAY */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Play className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                {/* DATE */}
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(rec.createdAt).toLocaleString()}
                </p>

                {/* MEETING ID */}
                <p className="text-sm font-medium text-gray-800 mb-3">
                  Meeting ID:{" "}
                  <span className="text-[#E51A54]">{rec.meetingId}</span>
                </p>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">
                  {/* DOWNLOAD */}
                  <a
                    href={rec.videoUrl}
                    download
                    className="flex items-center gap-1 text-sm text-[#E51A54] hover:underline"
                  >
                    <Download size={16} />
                    Download
                  </a>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(rec._id)}
                    className="p-2 rounded-lg hover:bg-red-100 transition cursor-pointer"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordingsPage;
