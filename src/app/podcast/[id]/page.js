"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles/index.css";
import PodcastMeetingUI from "@/components/podcast/PodcastMeetingUI";

export default function PodcastPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const isHost = searchParams.get("role") === "host";
  const [token, setToken] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("meeting_user_id") || crypto.randomUUID();
    localStorage.setItem("meeting_user_id", userId);
    const tokenUrl = "/api/token";
    fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, userId, isHost }),
    })
      .then((res) => res.json())
      .then((data) => setToken(data.token))
      .catch((err) => console.error("Token fetch failed", err));
  }, [roomId, isHost]);

  if (!token) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Connecting to podcast...</p>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://syncrys-8lcpweam.livekit.cloud"}
      token={token}
      connect={true}
      video={true}
      audio={true}
      className="h-screen w-screen bg-slate-700 text-white overflow-hidden"
      options={{
        publishDefaults: {
          videoEncoding: {
            maxBitrate: 500_000,
            maxFramerate: 20,
          },
          simulcast: true,
        },
      }}
    >
      <PodcastMeetingUI isHost={isHost} roomId={roomId} />
    </LiveKitRoom>
  );
}