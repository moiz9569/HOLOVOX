"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles/index.css";
import MeetingUI from "@/components/meeting-room/MeetingUI";
import { getTokenData } from "@/app/content/data";
import JoinMeetingModal from "@/components/JoinMeetingModal";
import { showErrorToast } from "../../../../lib/toast";
import { jwtDecode } from "jwt-decode";

export default function MeetingPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isHost = searchParams.get("role");
  // console.log("role",searchParams.get("role"));
  const [token, setToken] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [decodedUser, setDecodedUser] = useState(null);
  // const [loading, setLoading] = useState(true);
const [isUnauthorized, setIsUnauthorized] = useState(false);
//   useEffect(() => {
//     let userId, name , image;
// const value = localStorage.getItem("meeting_data");
//        console.log(value);
//        const [meetingCode, username] = value.split("_");

// console.log("Meeting Code:", meetingCode);
// console.log("Name:", username);
// if(meetingCode === roomId){
//   setIsUnauthorized(false);
//           showErrorToast('You are not authorized to join the meeting');
//           setOpenModal(false);
// }
// getTokenData()
//       .then((user) => {
//         console.log("Decoded User:", user);
//         if(!user){
//           console.log("No user data found in token");
//           setIsUnauthorized(true);
//           showErrorToast('You are not authorized to join the meeting');
//           setOpenModal(true);
//           return ;
//         }
        
//         setDecodedUser(user || {});
//         userId = user?.id ;
//         name = user?.name ;
//         image = user?.image || null;
//         console.log("Using userId:",user);
//         // console.log("Using name:",name);
//         console.log("Using userId:", userId, "and name:", name);
        
//          localStorage.setItem("meeting_user_id", userId);
//     const tokenUrl = "/api/token";
//     console.log("Fetching token with:", { roomId, userId, isHost , name,image});
//     fetch(tokenUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ roomId, userId, isHost, name, image }),
//     })  
//       .then((res) => res.json())
//       .then((data) => setToken(data.token))
//       .catch((err) => console.error("Token fetch failed", err));
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//         console.log("No user data found in token");
//           setIsUnauthorized(true);
//           showErrorToast('You are not authorized to join the meeting');
//           setOpenModal(true);
//         // setLoading(false);
//       });


//     // const userId = localStorage.getItem("meeting_user_id") || crypto.randomUUID();
//     // const userId = decodedUser?.id ;
//     // const name = decodedUser?.name || "Unknown User";
//     // console.log("Using userId:", userId, "and name:", name);
    
//   }, [roomId, isHost]);
// useEffect(async () => {
//   let userId, name, image;

//   const value = localStorage.getItem("meeting_data");

//   console.log("Stored value:", value);

//   // ❌ NO DATA → unauthorized
//   if (!value) {
//     setIsUnauthorized(true);
//     setOpenModal(true);
//     showErrorToast("No meeting data found");
//     return;
//   }

//   const [meetingCode, username] = value.split("_");

//   console.log("Meeting Code:", meetingCode);
//   console.log("Name:", username);
//   console.log("Expected Room ID:", roomId);

//   // ❌ WRONG ROOM → block access
//   if (meetingCode !== roomId) {
//     setIsUnauthorized(true);
//     setOpenModal(true);
//     showErrorToast("You are not authorized for this meeting");
//     return;
//   }

//   // ✅ MATCHED → allow
// const token = localStorage.getItem("token")
// const user = await jwtDecode(token);
// if(!user){
//   setIsUnauthorized(true);
//   setOpenModal(true);
//   showErrorToast("You are not authorized to join the meeting");
//   return ;
// }else{
//   setDecodedUser(user);
//     userId = user?.id;
//       name = user?.name;
//       image = user?.image || null;
//  fetch("/api/token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ roomId, userId, isHost, name, image }),
//       })
//         .then((res) => res.json())
//         .then((data) => setToken(data.token))
//         .catch((err) => console.error("Token fetch failed", err));
      
// }
// }, [roomId, isHost]);

useEffect(() => {
  const init = async () => {
    let userId, name, image;

    try {
      const meetingData = localStorage.getItem("meeting_data");
      const token = localStorage.getItem("token");

      console.log("meetingData:", meetingData);
      console.log("token:", token);

      // 🟢 CASE 1: meeting_data exists → DIRECT JOIN (NO TOKEN CHECK)
      if (meetingData) {
        const [meetingCode,username] = meetingData.split("_");

        console.log("Direct meeting join:", meetingCode);
        console.log("Name:", username);
        console.log("Expected Room ID:", roomId);

        // const user = token ? jwtDecode(token) : null;

        // if (!user) {
        //   setIsUnauthorized(true);
        //   setOpenModal(true);
        //   showErrorToast("Invalid token");
        //   return;
        // }

        // setDecodedUser(user);

        // userId = user?.id;
        // name = user?.name;
        // image = user?.image || null;

        const res = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId : meetingCode,
            userId : null,
            isHost : "guest",
            name : username,
            image : null,
          }),
        });

        const data = await res.json();
        setToken(data.token);
        console.log("Token fetched successfully for direct join");

        return; // ⛔ stop here
      }

      // 🟡 CASE 2: NO meeting_data → CHECK TOKEN FIRST
      if (token) {
        const user = jwtDecode(token);

        if (!user) {
          setIsUnauthorized(true);
          setOpenModal(true);
          showErrorToast("Invalid token");
          return;
        }

        setDecodedUser(user);

        userId = user?.id;
        name = user?.name;
        image = user?.image || null;

        const res = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId,
            userId,
            isHost,
            name,
            image,
          }),
        });

        const data = await res.json();
        setToken(data.token);

        return;
      }

      // 🔴 CASE 3: BOTH MISSING → MODAL
      setIsUnauthorized(true);
      setOpenModal(true);
      // showErrorToast("No access data found");
    } catch (error) {
      console.error("Init error:", error);
      setIsUnauthorized(true);
      setOpenModal(true);
    }
  };

  init();
}, [roomId, isHost]);
  if (isUnauthorized) {
  return (
    <>
      <JoinMeetingModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
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
