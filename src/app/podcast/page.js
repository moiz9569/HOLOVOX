"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Podcast, Video, ArrowRight } from "lucide-react";

export default function PodcastLanding() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");

  const startPodcast = () => {
    const id = uuidv4().slice(0, 6);
    router.push(`/podcast/${id}?role=host`);
  };

  const joinPodcast = () => {
    if (!joinCode.trim()) return;
    router.push(`/podcast/${joinCode.trim()}?role=guest`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E9164B] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Podcast className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Podcast Mode</h1>
          <p className="text-gray-600 mt-2">Immersive 3D meeting experience</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={startPodcast}
            className="w-full bg-[#E9164B] hover:bg-[#c0123e] text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Video className="w-5 h-5" />
            Start New Podcast
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 backdrop-blur-xl px-3 text-gray-500">or join existing</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter Podcast ID"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#E9164B] focus:ring-2 focus:ring-[#E9164B]/20"
            />
            <button
              onClick={joinPodcast}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl border border-gray-300 transition"
            >
              Join Podcast
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-xs text-center mt-6">
          Host creates a room and shares the ID with guests
        </p>
      </div>
    </div>
  );
}