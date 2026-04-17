"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles/index.css";
import MeetingUI from "@/components/meeting-room/MeetingUI";
import { getTokenData } from "@/app/content/data";

export default function MeetingPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isHost = searchParams.get("role");
  // console.log("role",searchParams.get("role"));
  const [token, setToken] = useState(null);
  const [decodedUser, setDecodedUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userId, name , image;
getTokenData()
      .then((user) => {
        console.log("Decoded User:", user);
        setDecodedUser(user || {});
        userId = user?.id ;
        name = user?.name ;
        image = user?.image || null;
        console.log("Using userId:",user);
        // console.log("Using name:",name);
        console.log("Using userId:", userId, "and name:", name);
        
         localStorage.setItem("meeting_user_id", userId);
    const tokenUrl = "/api/token";
    console.log("Fetching token with:", { roomId, userId, isHost , name,image});
    fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, userId, isHost, name, image }),
    })  
      .then((res) => res.json())
      .then((data) => setToken(data.token))
      .catch((err) => console.error("Token fetch failed", err));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // setLoading(false);
      });


    // const userId = localStorage.getItem("meeting_user_id") || crypto.randomUUID();
    // const userId = decodedUser?.id ;
    // const name = decodedUser?.name || "Unknown User";
    // console.log("Using userId:", userId, "and name:", name);
    
  }, [roomId, isHost]);

  if (!token) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={
        process.env.NEXT_PUBLIC_LIVEKIT_URL ||
        "wss://syncrys-8lcpweam.livekit.cloud"
      }
      token={token}
      connect={true}
      video={true}
      audio={true}
      className="h-screen w-screen bg-slate-700 text-white overflow-hidden"
      onDisconnected={() => console.log("Disconnected")}
      options={{
        publishDefaults: {
          videoEncoding: {
            maxBitrate: 1_000_000,
            maxFramerate: 24,
          },
        },
      }}
    >
      <MeetingUI isHost={isHost} roomId={roomId} router={router} />
    </LiveKitRoom>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { LiveKitRoom } from "@livekit/components-react";
// import "@livekit/components-styles/index.css";
// import MeetingUI from "@/components/meeting-room/MeetingUI";

// export default function MeetingPage() {
//   const { id: roomId } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const isHost = searchParams.get("role") === "host";
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const userId =
//       localStorage.getItem("meeting_user_id") || crypto.randomUUID();
//     localStorage.setItem("meeting_user_id", userId);
//     const tokenUrl =
//       process.env.NEXT_PUBLIC_TOKEN_URL || "http://localhost:7860/token";
//     fetch(tokenUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ roomId, userId, isHost }),
//     })
//       .then((res) => res.json())
//       .then((data) => setToken(data.token))
//       .catch((err) => console.error("Token fetch failed", err));
//   }, [roomId, isHost]);

//   if (!token) {
//     return (
//       <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p>Connecting to meeting...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <LiveKitRoom
//       serverUrl={
//         process.env.NEXT_PUBLIC_LIVEKIT_URL ||
//         "wss://syncrys-8lcpweam.livekit.cloud"
//       }
//       token={token}
//       connect={true}
//       video={true}
//       audio={true}
//       className="h-screen w-screen bg-slate-700 text-white overflow-hidden"
//       onDisconnected={() => console.log("Disconnected")}
//       options={{
//         publishDefaults: {
//           videoEncoding: {
//             maxBitrate: 1_000_000,
//             maxFramerate: 24,
//           },
//         },
//       }}
//     >
//       <MeetingUI isHost={isHost} roomId={roomId} router={router} />
//     </LiveKitRoom>
//   );
// }
