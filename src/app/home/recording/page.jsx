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
  X,
} from "lucide-react";
import { getTokenData } from "@/app/content/data";
import { showSuccessToast,showErrorToast } from "../../../../lib/toast";

const RecordingsPage = () => {
  const [activeTab, setActiveTab] = useState("cloud");
  const [userId, setUserId] = useState("");
  const [Recordings, setRecordings] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
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

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this recording?");
    if (!confirmDelete) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/user/upload-recording?recordingId=${id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Remove from UI immediately
        setRecordings((prevRecordings) => 
          prevRecordings.filter((rec) => rec._id !== id)
        );
        showSuccessToast("Recording deleted successfully!");
        console.log("Delete successful, recordingId:", id);
      } else {
        showErrorToast(data.message || "Failed to delete recording");
      }
    } catch (error) {
      console.error("Error deleting recording:", error);
      showErrorToast("Error deleting recording");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (videoUrl, meetingId) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `recording-${meetingId}-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccessToast("Download started!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#FAFBFF] to-[#F0F1FF] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E51A54] to-[#FF6B7A] bg-clip-text text-transparent">Recordings</h1>
        <p className="text-gray-600 text-base mt-2">
          Manage and access your meeting recordings
        </p>
      </div>

      {/* TABS */}
      {/* <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition transform ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#E51A54] to-[#FF6B7A] text-white shadow-lg shadow-[#E51A54]/30 scale-105"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-[#E51A54] hover:shadow-md"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div> */}

      {/* EMPTY STATE */}
      {Recordings.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <Video className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800">
              No recordings found
            </h2>
            <p className="text-gray-500 mt-2">
              Your meeting recordings will appear here
            </p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Recordings.map((rec) => (
            <div
              key={rec._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:scale-105 overflow-hidden border border-gray-100"
            >
              {/* VIDEO THUMBNAIL */}
              <div 
                className="relative group cursor-pointer bg-gray-900 h-48 flex items-center justify-center overflow-hidden"
                onClick={() => setSelectedVideo(rec)}
              >
                <video
                  src={rec.videoUrl}
                  className="w-full h-full object-cover"
                />

                {/* PLAY OVERLAY */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                  <div className="bg-[#E51A54] p-4 rounded-full hover:bg-[#FF6B7A] transition transform group-hover:scale-110">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                {/* DATE */}
                <p className="text-xs text-gray-500 mb-2">
                  📅 {new Date(rec.createdAt).toLocaleDateString()} at {new Date(rec.createdAt).toLocaleTimeString()}
                </p>

                {/* MEETING ID */}
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  Meeting: <span className="text-[#E51A54]">{rec.meetingId}</span>
                </p>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">
                  {/* DOWNLOAD */}
                  <button
                    onClick={() => handleDownload(rec.videoUrl, rec.meetingId)}
                    className="flex items-center gap-1.5 flex-1 justify-center px-4 py-2 bg-gradient-to-r from-[#E51A54] to-[#FF6B7A] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-[#E51A54]/30 transition transform hover:scale-105"
                  >
                    <Download size={16} />
                    Download
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(rec._id)}
                    disabled={deletingId === rec._id}
                    className={`p-2 rounded-lg transition transform hover:scale-110 ${
                      deletingId === rec._id
                        ? "bg-red-200 cursor-wait"
                        : "bg-red-50 hover:bg-red-100"
                    }`}
                    title="Delete recording"
                  >
                    <Trash2 size={18} className={deletingId === rec._id ? "text-red-600 animate-spin" : "text-red-500"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULLSCREEN VIDEO MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition transform hover:scale-110"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Video Player */}
            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              className="w-full rounded-xl shadow-2xl"
            />

            {/* Video Info */}
            <div className="mt-4 text-white">
              <p className="text-sm opacity-75">Meeting ID: <span className="text-[#E51A54] font-semibold">{selectedVideo.meetingId}</span></p>
              <p className="text-sm opacity-75 mt-1">{new Date(selectedVideo.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  }

export default RecordingsPage
