"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { startMeeting, stopMeeting } from "@/components/webrtc";

function MeetingContent() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isHost = searchParams.get("role") === "host";
  
  const [remotePeers, setRemotePeers] = useState([]); 
  const [activeStreamId, setActiveStreamId] = useState("local"); 
  const [isAframeLoaded, setIsAframeLoaded] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAframeLoaded) {
      startMeeting(roomId, isHost, (peerId, stream, peerIsHost) => {
        setRemotePeers(prev => {
          if (prev.find(p => p.id === peerId)) return prev;
          if (!isHost && peerIsHost) setActiveStreamId(peerId);
          return [...prev, { id: peerId, stream, isHost: peerIsHost }];
        });
      });
    }
    return () => { stopMeeting(); };
  }, [isAframeLoaded, roomId, isHost]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
    alert("Link Copied!");
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden text-white">
      <Script src="https://aframe.io/releases/1.5.0/aframe.min.js" onLoad={() => setIsAframeLoaded(true)} />

      {/* TOP CONTROLS */}
      <div className="absolute top-0 w-full z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-600/20 border border-red-600/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" /> Live
          </div>
          <h1 className="text-sm font-medium opacity-70">Room: {roomId}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <button onClick={() => { stopMeeting(); router.push("/"); }} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl text-sm font-black transition-all">LEAVE</button>
        </div>
      </div>

      {/* SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-80 bg-neutral-900 border-l border-white/10 p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Meeting Details</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Share Link</label>
                <div className="mt-2 flex gap-2">
                  <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/meeting/${roomId}`} className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-xs truncate" />
                  <button onClick={copyLink} className="bg-blue-600 p-2 rounded text-xs">Copy</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Participants</label>
                <div className="mt-2 space-y-2">
                   <div className="text-sm flex items-center gap-2 italic opacity-60 font-medium tracking-wide">You ({isHost ? "Host" : "Guest"})</div>
                   {remotePeers.map(p => (
                     <div key={p.id} className="text-sm flex items-center gap-2">
                       {p.isHost ? "⭐ Host" : "👤 Guest"} ({p.id.slice(0,4)})
                     </div>
                   ))}
                </div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="absolute bottom-6 left-6 right-6 p-3 border border-white/10 rounded-xl text-sm opacity-50">Close</button>
          </div>
        </div>
      )}

      {/* VR SCENE */}
      <div className="flex-1 relative">
        {isAframeLoaded ? (
          <a-scene embedded style={{height: '100%', width: '100%'}} vr-mode-ui="enabled: false" renderer="antialias: false; precision: lowp;">
            <a-assets>
              {remotePeers.map(p => (
                <video key={p.id} id={`vid-${p.id}`} autoPlay playsInline ref={el => { if(el) el.srcObject = p.stream }} />
              ))}
            </a-assets>
            <a-videosphere 
              src={activeStreamId === "local" ? "#localVideo" : `#vid-${activeStreamId}`} 
              rotation="0 -90 0" material="shader: flat;">
            </a-videosphere>
            <a-camera look-controls="pointerLockEnabled: false"></a-camera>
          </a-scene>
        ) : <div className="h-full flex items-center justify-center font-bold">BOOTING VR...</div>}
      </div>

      {/* BOTTOM GRID */}
      <div className="h-44 bg-neutral-950 border-t border-white/5 flex items-center px-4 gap-4 overflow-x-auto z-40">
        {/* Your Box */}
        <div onClick={() => setActiveStreamId("local")} className={`relative min-w-[180px] h-32 rounded-2xl border-2 transition-all cursor-pointer ${activeStreamId === "local" ? "border-blue-500 scale-105 z-10" : "border-white/5 opacity-40"}`}>
          <video id="localVideo" autoPlay muted playsInline className="w-full h-full object-cover rounded-2xl" />
          <div className="absolute top-2 left-2 bg-blue-600 text-[8px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">YOU</div>
        </div>

        {/* Peer Boxes */}
        {remotePeers.map(peer => (
          <div key={peer.id} onClick={() => setActiveStreamId(peer.id)} className={`relative min-w-[180px] h-32 rounded-2xl border-2 transition-all cursor-pointer ${activeStreamId === peer.id ? "border-blue-500 scale-105 z-10" : "border-white/5 opacity-40"}`}>
            <video autoPlay playsInline ref={el => { if(el) el.srcObject = peer.stream }} className="w-full h-full object-cover rounded-2xl" />
            <div className={`absolute top-2 left-2 text-[8px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${peer.isHost ? "bg-amber-500" : "bg-neutral-800"}`}>
              {peer.isHost ? "HOST" : "GUEST"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MeetingPage() {
  return <Suspense fallback={null}><MeetingContent /></Suspense>;
}

//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////
















// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useParams } from "next/navigation";
// import Script from "next/script";
// import { startMeeting } from "@/components/webrtc";

// export default function MeetingPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const roomId = params.id;
//   const role = searchParams.get("role") || "guest";
  
//   const [guestLink, setGuestLink] = useState("");
//   const [viewMode, setViewMode] = useState("360");
//   const [isAframeLoaded, setIsAframeLoaded] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

//   // Clock Update
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     if (roomId && isAframeLoaded) startMeeting(roomId);
//     if (role === "host") {
//       setGuestLink(`${window.location.origin}/meeting/${roomId}?role=guest`);
//     }
//   }, [roomId, role, isAframeLoaded]);

//   const copyLink = () => {
//     navigator.clipboard.writeText(guestLink);
//     alert("Invite link copied to clipboard!");
//   };

//   return (
//     <div className="w-screen h-screen bg-black relative overflow-hidden font-sans">
//       <Script 
//         src="https://aframe.io/releases/1.5.0/aframe.min.js" 
//         strategy="afterInteractive"
//         onLoad={() => setIsAframeLoaded(true)}
//       />

//       {/* Professional Header Bar */}
//       <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center px-8 z-[100] backdrop-blur-[2px]">
//         <div className="flex items-center gap-6">
//           <div className="flex flex-col">
//             <span className="text-white font-black text-xl tracking-tighter">360° CONNECT</span>
//             <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Live Session</span>
//           </div>
//           <div className="h-8 w-px bg-white/20"></div>
//           <div className="flex flex-col text-gray-300">
//             <span className="text-xs font-bold">{currentTime}</span>
//             <span className="text-[10px] text-gray-500 uppercase">Room ID: {roomId}</span>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <button 
//             onClick={() => setViewMode(viewMode === "360" ? "flat" : "360")} 
//             className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-all border border-white/10"
//           >
//             {viewMode === "360" ? "Show Grid View" : "Show 360° View"}
//           </button>
//           <button 
//             onClick={() => window.location.href = "/"} 
//             className="px-6 py-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-full text-xs font-bold transition-all border border-red-500/20"
//           >
//             End Call
//           </button>
//         </div>
//       </div>

//       {/* Floating Invite Box (Host Only) */}
//       {role === "host" && guestLink && (
//         <div className="absolute top-20 right-8 bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl z-50 w-80">
//           <h4 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
//             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Invite Participant
//           </h4>
//           <div className="flex flex-col gap-2">
//             <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-gray-400 text-[11px] font-mono break-all leading-tight">
//               {guestLink}
//             </div>
//             <button onClick={copyLink} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all">
//               Copy Link
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Experience */}
//       <div className="w-full h-full relative z-10">
//         {viewMode === "360" ? (
//           isAframeLoaded ? (
//             <a-scene embedded style={{ width: "100%", height: "100%" }} vr-mode-ui="enabled: false">
//               <a-assets id="assets-box"></a-assets>
//               <a-entity camera look-controls="pointerLockEnabled: false" position="0 1.6 0"></a-entity>
//               <a-videosphere id="main-360-view" rotation="0 -90 0" material="shader: flat;"></a-videosphere>
//               <a-sky id="background-sky" color="#050505"></a-sky>
//             </a-scene>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full gap-4">
//                 <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
//                 <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Optimizing VR Engine</p>
//             </div>
//           )
//         ) : (
//           <div className="absolute inset-0 pt-24 px-12 bg-[#0a0a0a] z-20 overflow-y-auto">
//             <h2 className="text-white text-sm font-bold uppercase tracking-widest mb-6 opacity-50">Participant Grid</h2>
//             <div id="remote-grid-container" className="grid grid-cols-2 gap-8"></div>
//           </div>
//         )}
//       </div>

//       {/* User Branding Label (Local Preview) */}
//       <div className="absolute bottom-8 left-8 z-[110] group">
//         <div className="relative">
//           <video id="localVideo" autoPlay muted playsInline className="w-64 h-40 border border-white/20 rounded-2xl bg-black shadow-2xl object-cover transform group-hover:scale-105 transition-all duration-500" />
//           <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
//             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
//             <span className="text-white text-[10px] font-bold uppercase tracking-tighter">Self View (360 Input)</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

















// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useParams } from "next/navigation";
// import Script from "next/script";
// import { startMeeting } from "@/components/webrtc";

// export default function MeetingPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const roomId = params.id;
//   const isAframeLoaded = useAframeLoader();

//   useEffect(() => {
//     if (roomId && isAframeLoaded) startMeeting(roomId);
//   }, [roomId, isAframeLoaded]);

//   return (
//     <div className="w-screen h-screen bg-black relative overflow-hidden">
//       <Script 
//         src="https://aframe.io/releases/1.5.0/aframe.min.js" 
//         strategy="afterInteractive"
//       />

//       {/* Control UI */}
//       <div className="absolute top-0 left-0 w-full h-16 bg-black/80 flex justify-between items-center px-6 z-[100]">
//         <div className="text-white font-bold text-xl">360° CONNECT</div>
//         <button onClick={() => window.location.href = "/"} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm">Leave</button>
//       </div>

//       <div className="w-full h-full relative z-10">
//         {isAframeLoaded ? (
//           /* PERFORMANCE FIX: Add vr-mode-ui="enabled: false" and disable extra lights */
//           <a-scene 
//             embedded 
//             vr-mode-ui="enabled: false" 
//             renderer="antialias: false; precision: medium; fpsLimit: 60;"
//             style={{ width: "100%", height: "100%" }}
//           >
//             <a-assets id="assets-box"></a-assets>
//             <a-entity camera look-controls="pointerLockEnabled: false"></a-entity>
            
//             {/* PERFORMANCE FIX: Shader: flat is much faster because it doesn't calculate light shadows */}
//             <a-videosphere 
//               id="main-360-view" 
//               rotation="0 -90 0" 
//               material="shader: flat; npot: true;"
//             ></a-videosphere>
            
//             <a-sky id="background-sky" color="#111"></a-sky>
//           </a-scene>
//         ) : (
//           <div className="text-white flex h-full items-center justify-center">Optimizing Stream...</div>
//         )}
//       </div>

//       <div className="absolute bottom-6 left-6 z-[110]">
//         <video id="localVideo" autoPlay muted playsInline className="w-48 h-32 border-2 border-blue-500 rounded-lg bg-black" />
//       </div>
//     </div>
//   );
// }

// // Helper to track script load
// function useAframeLoader() {
//   const [loaded, setLoaded] = useState(false);
//   useEffect(() => {
//     const check = setInterval(() => {
//       if (window.AFRAME) {
//         setLoaded(true);
//         clearInterval(check);
//       }
//     }, 100);
//     return () => clearInterval(check);
//   }, []);
//   return loaded;
// }

















// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useParams } from "next/navigation";
// import Script from "next/script";
// import { startMeeting } from "@/components/webrtc";

// export default function MeetingPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const roomId = params.id;
//   const role = searchParams.get("role") || "guest";
  
//   const [guestLink, setGuestLink] = useState("");
//   const [viewMode, setViewMode] = useState("360");
//   const [isAframeLoaded, setIsAframeLoaded] = useState(false);

//   useEffect(() => {
//     if (roomId && isAframeLoaded) {
//       startMeeting(roomId);
//     }
//     if (role === "host") {
//       setGuestLink(`${window.location.origin}/meeting/${roomId}?role=guest`);
//     }
//   }, [roomId, role, isAframeLoaded]);

//   const copyLink = () => {
//     navigator.clipboard.writeText(guestLink);
//     alert("Link Copied!");
//   };

//   return (
//     <div className="w-screen h-screen bg-black relative overflow-hidden">
//       <Script 
//         src="https://aframe.io/releases/1.5.0/aframe.min.js" 
//         strategy="afterInteractive"
//         onLoad={() => setIsAframeLoaded(true)}
//       />

//       <div className="absolute top-0 left-0 w-full h-16 bg-black/90 flex justify-between items-center px-6 z-[100]">
//         <div className="text-white font-bold text-xl">360° CONNECT</div>
//         <div className="flex gap-3">
//           <button 
//             onClick={() => setViewMode(viewMode === "360" ? "flat" : "360")} 
//             className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
//           >
//             {viewMode === "360" ? "Flat View" : "360° View"}
//           </button>
//           {role === "host" && (
//             <button onClick={copyLink} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm">
//               Copy Invite
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="w-full h-full relative z-10">
//         {viewMode === "360" ? (
//           isAframeLoaded ? (
//             <a-scene embedded style={{ width: "100%", height: "100%" }}>
//               <a-assets id="assets-box"></a-assets>
//               <a-entity camera look-controls position="0 1.6 0"></a-entity>
//               <a-videosphere id="main-360-view" rotation="0 -90 0" material="shader: flat; side: double;"></a-videosphere>
//               <a-sky id="background-sky" color="#111"></a-sky>
//             </a-scene>
//           ) : (
//             <div className="text-white flex h-full items-center justify-center">Loading...</div>
//           )
//         ) : (
//           <div className="absolute inset-0 pt-20 px-10 bg-gray-900 z-20">
//             <div id="remote-grid-container" className="grid grid-cols-2 gap-4"></div>
//           </div>
//         )}
//       </div>

//       <div className="absolute bottom-6 left-6 z-[110]">
//         <video id="localVideo" autoPlay muted playsInline className="w-48 h-32 border-2 border-blue-500 rounded-lg bg-black" />
//       </div>
//     </div>
//   );
// }