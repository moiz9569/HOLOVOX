"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function LandingPage() {
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  const createMeeting = () => {
    const roomId = uuidv4().slice(0, 6);
    router.push(`/meeting/${roomId}?role=host`);
  };

  const joinMeeting = () => {
    if (!joinCode.trim()) return alert("Enter meeting code!");
    router.push(`/meeting/${joinCode}?role=guest`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>

      <div className="z-10 text-center max-w-2xl">
        <h1 className="text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          360° CONNECT
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          The next generation of immersive video collaboration. Connect your 360° hardware and step into the same room, from anywhere in the world.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <button
            onClick={createMeeting}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            Start New Meeting
          </button>

          <div className="h-px w-full md:h-12 md:w-px bg-white/10"></div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition text-center font-mono tracking-widest"
            />
            <button
              onClick={joinMeeting}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
            >
              Join
            </button>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center gap-8 text-sm text-gray-500 font-medium uppercase tracking-widest">
            <span>Encrypted P2P</span>
            <span>•</span>
            <span>Spatial Audio</span>
            <span>•</span>
            <span>360° Rendering</span>
        </div>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////














// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";

// export default function LandingPage() {
//   const [joinCode, setJoinCode] = useState("");
//   const router = useRouter();

//   const createMeeting = () => {
//     const roomId = uuidv4().slice(0, 6);
//     router.push(`/meeting/${roomId}`);
//   };

//   const joinMeeting = () => {
//     if (!joinCode.trim()) return alert("Enter meeting code!");
//     router.push(`/meeting/${joinCode}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
//       <h1 className="text-5xl font-extrabold text-gray-800 mb-2">360° Meeting</h1>
//       <p className="text-gray-500 mb-8">Secure video meetings</p>

//       <div className="flex flex-col md:flex-row items-center gap-4">
//         <button
//           onClick={createMeeting}
//           className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
//         >
//           Create Meeting
//         </button>

//         <div className="flex items-center gap-2 mt-4 md:mt-0">
//           <input
//             type="text"
//             placeholder="Enter meeting code"
//             value={joinCode}
//             onChange={(e) => setJoinCode(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg"
//           />
//           <button
//             onClick={joinMeeting}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Join
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
