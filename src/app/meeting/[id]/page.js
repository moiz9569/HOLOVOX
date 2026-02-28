// "use client";
// import { useEffect, useState, Suspense } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import Script from "next/script";
// import { startMeeting, stopMeeting } from "@/components/webrtc";

// function MeetingContent() {
//   const { id: roomId } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const isHost = searchParams.get("role") === "host";
  
//   const [remotePeers, setRemotePeers] = useState([]); 
//   const [activeStreamId, setActiveStreamId] = useState("local"); 
//   const [isAframeLoaded, setIsAframeLoaded] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (isAframeLoaded) {
//       startMeeting(roomId, isHost, (peerId, stream, peerIsHost) => {
//         setRemotePeers(prev => {
//           if (prev.find(p => p.id === peerId)) return prev;
//           if (!isHost && peerIsHost) setActiveStreamId(peerId);
//           return [...prev, { id: peerId, stream, isHost: peerIsHost }];
//         });
//       });
//     }
//     return () => { stopMeeting(); };
//   }, [isAframeLoaded, roomId, isHost]);

//   const copyLink = () => {
//     navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
//     alert("Link Copied!");
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col overflow-hidden text-white">
//       <Script src="https://aframe.io/releases/1.5.0/aframe.min.js" onLoad={() => setIsAframeLoaded(true)} />

//       {/* TOP CONTROLS */}
//       <div className="absolute top-0 w-full z-50 p-4 flex justify-between items-center bg-linear-to-b from-black/90 to-transparent">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 bg-red-600/20 border border-red-600/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
//             <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" /> Live
//           </div>
//           <h1 className="text-sm font-medium opacity-70">Room: {roomId}</h1>
//         </div>
//         <div className="flex gap-2">
//           <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
//             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//           </button>
//           <button onClick={() => { stopMeeting(); router.push("/"); }} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl text-sm font-black transition-all">LEAVE</button>
//         </div>
//       </div>

//       {/* SIDEBAR */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 z-100 flex justify-end">
//           <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
//           <div className="relative w-80 bg-neutral-900 border-l border-white/10 p-6 shadow-2xl">
//             <h2 className="text-xl font-bold mb-6">Meeting Details</h2>
//             <div className="space-y-6">
//               <div>
//                 <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Share Link</label>
//                 <div className="mt-2 flex gap-2">
//                   <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/meeting/${roomId}`} className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-xs truncate" />
//                   <button onClick={copyLink} className="bg-blue-600 p-2 rounded text-xs">Copy</button>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Participants</label>
//                 <div className="mt-2 space-y-2">
//                    <div className="text-sm flex items-center gap-2 italic opacity-60 font-medium tracking-wide">You ({isHost ? "Host" : "Guest"})</div>
//                    {remotePeers.map(p => (
//                      <div key={p.id} className="text-sm flex items-center gap-2">
//                        {p.isHost ? "⭐ Host" : "👤 Guest"} ({p.id.slice(0,4)})
//                      </div>
//                    ))}
//                 </div>
//               </div>
//             </div>
//             <button onClick={() => setSidebarOpen(false)} className="absolute bottom-6 left-6 right-6 p-3 border border-white/10 rounded-xl text-sm opacity-50">Close</button>
//           </div>
//         </div>
//       )}

//       {/* VR SCENE */}
//       <div className="flex-1 relative">
//         {isAframeLoaded ? (
//           <a-scene embedded style={{height: '100%', width: '100%'}} vr-mode-ui="enabled: false" renderer="antialias: false; precision: lowp;">
//             <a-assets>
//               {remotePeers.map(p => (
//                 <video key={p.id} id={`vid-${p.id}`} autoPlay playsInline ref={el => { if(el) el.srcObject = p.stream }} />
//               ))}
//             </a-assets>
//             <a-videosphere 
//               src={activeStreamId === "local" ? "#localVideo" : `#vid-${activeStreamId}`} 
//               rotation="0 -90 0" material="shader: flat;">
//             </a-videosphere>
//             <a-camera look-controls="pointerLockEnabled: false"></a-camera>
//           </a-scene>
//         ) : <div className="h-full flex items-center justify-center font-bold">BOOTING VR...</div>}
//       </div>

//       {/* BOTTOM GRID */}
//       <div className="h-44  border-t border-white/5 flex items-center px-4 gap-4 overflow-x-auto z-40">
//         {/* Your Box */}
//         <div onClick={() => setActiveStreamId("local")} className={`relative min-w-45 h-32 rounded-2xl border-2 transition-all cursor-pointer ${activeStreamId === "local" ? "border-blue-500 scale-105 z-10" : "border-white/5 opacity-40"}`}>
//           <video id="localVideo" autoPlay muted playsInline className="w-full h-full object-cover rounded-2xl" />
//           <div className="absolute top-2 left-2 bg-blue-600 text-[8px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">YOU</div>
//         </div>

//         {/* Peer Boxes */}
//         {remotePeers.map(peer => (
//           <div key={peer.id} onClick={() => setActiveStreamId(peer.id)} className={`relative min-w-45 h-32 rounded-2xl border-2 transition-all cursor-pointer ${activeStreamId === peer.id ? "border-blue-500 scale-105 z-10" : "border-white/5 opacity-40"}`}>
//             <video autoPlay playsInline ref={el => { if(el) el.srcObject = peer.stream }} className="w-full h-full object-cover rounded-2xl" />
//             <div className={`absolute top-2 left-2 text-[8px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${peer.isHost ? "bg-amber-500" : "bg-neutral-800"}`}>
//               {peer.isHost ? "HOST" : "GUEST"}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function MeetingPage() {
//   return <Suspense fallback={null}><MeetingContent /></Suspense>;
// }












// "use client";
// import { useEffect, useState, Suspense } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import Script from "next/script";
// import { startMeeting, stopMeeting } from "@/components/webrtc";

// function MeetingContent() {
//   const { id: roomId } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const isHost = searchParams.get("role") === "host";
  
//   const [remotePeers, setRemotePeers] = useState([]); 
//   const [activeStreamId, setActiveStreamId] = useState("local"); 
//   const [isAframeLoaded, setIsAframeLoaded] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (isAframeLoaded) {
//       startMeeting(roomId, isHost, (peerId, stream, peerIsHost) => {
//         setRemotePeers(prev => {
//           if (prev.find(p => p.id === peerId)) return prev;
//           if (!isHost && peerIsHost) setActiveStreamId(peerId);
//           return [...prev, { id: peerId, stream, isHost: peerIsHost }];
//         });
//       });
//     }
//     return () => { stopMeeting(); };
//   }, [isAframeLoaded, roomId, isHost]);

//   const copyLink = () => {
//     navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
//     alert("Link Copied!");
//   };

//  return (
//   <div className="h-screen w-screen bg-[#0f172a] text-white flex overflow-hidden">

//     <Script
//       src="https://aframe.io/releases/1.5.0/aframe.min.js"
//       onLoad={() => setIsAframeLoaded(true)}
//     />

//     {/* ================= MAIN CONTENT ================= */}
//     <div className="flex-1 flex flex-col relative">

//       {/* ======= TOP NAVBAR ======= */}
//       <div className="h-16 px-6 flex items-center justify-between bg-[#111827] border-b border-white/5">
//         <div>
//           <h1 className="text-sm font-semibold">Business Weekly Meeting</h1>
//           <p className="text-xs text-white/40">Room: {roomId}</p>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold">
//             {isHost ? "H" : "G"}
//           </div>

//           <button
//             onClick={() => { stopMeeting(); router.push("/"); }}
//             className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-xs font-semibold transition"
//           >
//             Leave
//           </button>
//         </div>
//       </div>

//       {/* ======= MAIN VIDEO AREA ======= */}
//       <div className="flex-1 relative bg-black">

//         {isAframeLoaded ? (
//           <a-scene
//             embedded
//             style={{ height: "100%", width: "100%" }}
//             vr-mode-ui="enabled: false"
//             renderer="antialias: true;"
//           >
//             <a-assets>
//               {remotePeers.map(p => (
//                 <video
//                   key={p.id}
//                   id={`vid-${p.id}`}
//                   autoPlay
//                   playsInline
//                   ref={el => { if (el) el.srcObject = p.stream }}
//                 />
//               ))}
//             </a-assets>

//             <a-videosphere
//               src={
//                 activeStreamId === "local"
//                   ? "#localVideo"
//                   : `#vid-${activeStreamId}`
//               }
//               rotation="0 -90 0"
//               material="shader: flat;"
//             />

//             <a-camera look-controls="pointerLockEnabled: false" />
//           </a-scene>
//         ) : (
//           <div className="h-full flex items-center justify-center text-lg font-semibold">
//             Connecting...
//           </div>
//         )}

//         {/* ===== Floating Participants Thumbnails ===== */}
//         <div className="absolute bottom-24 left-0 right-0 px-6 flex gap-4 overflow-x-auto">
//           {/* Local */}
//           <div
//             onClick={() => setActiveStreamId("local")}
//             className={`relative min-w-[140px] h-24 rounded-xl overflow-hidden border transition-all cursor-pointer ${
//               activeStreamId === "local"
//                 ? "border-cyan-500 scale-105"
//                 : "border-white/10 opacity-70"
//             }`}
//           >
//             <video
//               id="localVideo"
//               autoPlay
//               muted
//               playsInline
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-2 py-1 rounded">
//               You
//             </div>
//           </div>

//           {remotePeers.map(peer => (
//             <div
//               key={peer.id}
//               onClick={() => setActiveStreamId(peer.id)}
//               className={`relative min-w-[140px] h-24 rounded-xl overflow-hidden border transition-all cursor-pointer ${
//                 activeStreamId === peer.id
//                   ? "border-cyan-500 scale-105"
//                   : "border-white/10 opacity-70"
//               }`}
//             >
//               <video
//                 autoPlay
//                 playsInline
//                 ref={el => { if (el) el.srcObject = peer.stream }}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-2 py-1 rounded">
//                 {peer.isHost ? "Host" : "Guest"}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ===== Floating Controls ===== */}
//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-[#111827]/90 backdrop-blur-lg px-8 py-4 rounded-full shadow-2xl border border-white/10">
//           <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
//             🎤
//           </button>
//           <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
//             🎥
//           </button>
//           <button
//             onClick={() => { stopMeeting(); router.push("/"); }}
//             className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-xl"
//           >
//             ⛔
//           </button>
//           <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
//             💬
//           </button>
//         </div>

//       </div>
//     </div>

//     {/* ================= RIGHT SIDEBAR ================= */}
//     <div className="w-80 bg-[#111827] border-l border-white/5 flex flex-col">

//       <div className="p-6 border-b border-white/5">
//         <h2 className="text-sm font-semibold">Participants</h2>
//         <p className="text-xs text-white/40 mt-1">
//           {remotePeers.length + 1} in meeting
//         </p>
//       </div>

//       <div className="flex-1 overflow-y-auto p-6 space-y-4">

//         <div className="text-sm flex items-center justify-between">
//           <span>You ({isHost ? "Host" : "Guest"})</span>
//           <span className="text-green-400 text-xs">●</span>
//         </div>

//         {remotePeers.map(p => (
//           <div key={p.id} className="text-sm flex items-center justify-between">
//             <span>{p.isHost ? "⭐ Host" : "👤 Guest"}</span>
//             <span className="text-green-400 text-xs">●</span>
//           </div>
//         ))}

//       </div>

//       <div className="p-6 border-t border-white/5">
//         <button
//           onClick={copyLink}
//           className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg text-sm font-semibold transition"
//         >
//           Copy Invite Link
//         </button>
//       </div>

//     </div>
//   </div>
// );
// }

// export default function MeetingPage() {
//   return <Suspense fallback={null}><MeetingContent /></Suspense>;
// }

















"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Video, VideoOff, Phone, MessageSquare, 
  Users, Copy, MoreVertical, Settings, Share2, 
  Maximize2, Minimize2, ScreenShare, Volume2, 
  Crown, User as UserIcon, X, Check, ChevronLeft,
  ChevronRight, AlertCircle, Wifi, WifiOff
} from "lucide-react";
import { startMeeting, stopMeeting } from "@/components/webrtc";

function MeetingContent() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isHost = searchParams.get("role") === "host";
  
  const [remotePeers, setRemotePeers] = useState([]); 
  const [activeStreamId, setActiveStreamId] = useState("local"); 
  const [isAframeLoaded, setIsAframeLoaded] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("good"); // good, average, poor
  const [showControls, setShowControls] = useState(true);
  const [activeTab, setActiveTab] = useState("participants"); // participants, chat
  const [notification, setNotification] = useState(null);
  const [hoveredParticipant, setHoveredParticipant] = useState(null);
  
  const controlsTimeoutRef = useRef(null);
  const videoRefs = useRef({});
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (isAframeLoaded) {
      startMeeting(roomId, isHost, (peerId, stream, peerIsHost) => {
        setRemotePeers(prev => {
          if (prev.find(p => p.id === peerId)) return prev;
          if (!isHost && peerIsHost) setActiveStreamId(peerId);
          
          // Show notification for new participant
          showNotification(`${peerIsHost ? 'Host' : 'Guest'} joined the meeting`);
          
          return [...prev, { id: peerId, stream, isHost: peerIsHost, isMuted: false, isVideoOff: false }];
        });
      });
      
      // Simulate connection quality changes (remove in production)
      const interval = setInterval(() => {
        const qualities = ["good", "average", "poor"];
        setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      }, 10000);
      
      return () => clearInterval(interval);
    }
    return () => { stopMeeting(); };
  }, [isAframeLoaded, roomId, isHost]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Scroll chat to bottom when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
    showNotification("Invite link copied to clipboard!", "success");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), text: newMessage, sender: "You", timestamp: new Date() }]);
      setNewMessage("");
      showNotification("Message sent", "success");
    }
  };

  const toggleAudio = () => {
    setIsMuted(!isMuted);
    showNotification(isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    showNotification(isVideoOff ? "Camera turned on" : "Camera turned off");
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    showNotification(isScreenSharing ? "Stopped screen sharing" : "Started screen sharing");
  };

  const getConnectionColor = () => {
    switch(connectionQuality) {
      case "good": return "text-green-400";
      case "average": return "text-yellow-400";
      case "poor": return "text-red-400";
      default: return "text-green-400";
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex overflow-hidden">
      
      <Script
        src="https://aframe.io/releases/1.5.0/aframe.min.js"
        onLoad={() => setIsAframeLoaded(true)}
      />

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 ${
              notification.type === "success" ? "bg-green-600" : 
              notification.type === "error" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {notification.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col relative">
        
        {/* ======= TOP NAVBAR (Glassmorphic) ======= */}
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: showControls ? 0 : -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <span className="text-lg font-bold">H</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold flex items-center gap-2">
                Business Weekly Meeting
                {isHost && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs flex items-center gap-1">
                    <Crown size={12} /> Host
                  </span>
                )}
              </h1>
              <p className="text-xs text-white/40">Room: {roomId.slice(0, 8)}...</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Quality Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
              <Wifi className={`w-4 h-4 ${getConnectionColor()}`} />
              <span className="text-xs capitalize">{connectionQuality}</span>
            </div>

            {/* Timer */}
            <div className="px-3 py-1.5 bg-white/5 rounded-lg">
              <span className="text-xs font-mono">00:15:23</span>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </motion.div>

        {/* ======= MAIN VIDEO AREA ======= */}
        <div className="flex-1 relative bg-black overflow-hidden">
          
          {isAframeLoaded ? (
            <a-scene
              embedded
              style={{ height: "100%", width: "100%" }}
              vr-mode-ui="enabled: false"
              renderer="antialias: true; colorManagement: true;"
            >
              <a-assets>
                {remotePeers.map(p => (
                  <video
                    key={p.id}
                    id={`vid-${p.id}`}
                    autoPlay
                    playsInline
                    ref={el => { if (el) { el.srcObject = p.stream; videoRefs.current[p.id] = el; } }}
                  />
                ))}
              </a-assets>

              <a-videosphere
                src={
                  activeStreamId === "local"
                    ? "#localVideo"
                    : `#vid-${activeStreamId}`
                }
                rotation="0 -90 0"
                material="shader: flat; side: double;"
              />

              <a-camera look-controls="pointerLockEnabled: false" wasd-controls="enabled: false" />
            </a-scene>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-semibold text-white/70">Connecting to 360° environment...</p>
              </div>
            </div>
          )}

          {/* ===== Connection Status Overlay ===== */}
          {connectionQuality === "poor" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-lg px-4 py-2 rounded-full text-sm flex items-center gap-2"
            >
              <WifiOff size={16} />
              <span>Poor connection quality</span>
            </motion.div>
          )}

          {/* ===== Floating Participants Thumbnails ===== */}
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: showControls ? 0 : 100 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-24 left-0 right-0 px-6 z-10"
          >
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {/* Local */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStreamId("local")}
                className={`relative min-w-[160px] h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                  activeStreamId === "local"
                    ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <video
                  id="localVideo"
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
                    <UserIcon size={10} />
                    <span>You</span>
                  </div>
                  <div className="flex gap-1">
                    {isMuted && <MicOff size={10} className="text-red-400" />}
                    {isVideoOff && <VideoOff size={10} className="text-red-400" />}
                  </div>
                </div>
                {hoveredParticipant === "local" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Maximize2 size={20} className="text-white/70" />
                  </div>
                )}
              </motion.div>

              {remotePeers.map(peer => (
                <motion.div
                  key={peer.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredParticipant(peer.id)}
                  onHoverEnd={() => setHoveredParticipant(null)}
                  onClick={() => setActiveStreamId(peer.id)}
                  className={`relative min-w-[160px] h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                    activeStreamId === peer.id
                      ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <video
                    autoPlay
                    playsInline
                    ref={el => { if (el) { el.srcObject = peer.stream; videoRefs.current[peer.id] = el; } }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
                      {peer.isHost ? <Crown size={10} className="text-amber-400" /> : <UserIcon size={10} />}
                      <span>{peer.isHost ? "Host" : "Guest"}</span>
                    </div>
                    <div className="flex gap-1">
                      {peer.isMuted && <MicOff size={10} className="text-red-400" />}
                      {peer.isVideoOff && <VideoOff size={10} className="text-red-400" />}
                    </div>
                  </div>
                  {hoveredParticipant === peer.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Maximize2 size={20} className="text-white/70" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ===== Floating Controls ===== */}
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: showControls ? 0 : 100 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
              {/* Audio Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleAudio}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </motion.button>

              {/* Video Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </motion.button>

              {/* Screen Share */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleScreenShare}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                  isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <ScreenShare size={20} />
              </motion.button>

              {/* Leave Call */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { stopMeeting(); router.push("/"); }}
                className="w-14 h-14 rounded-xl bg-red-600 hover:bg-red-700 flex items-center justify-center transition shadow-lg shadow-red-600/20"
              >
                <Phone size={24} className="rotate-135" />
              </motion.button>

              {/* Participants Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowParticipants(!showParticipants)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition relative ${
                  showParticipants ? 'bg-cyan-600' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Users size={20} />
                {remotePeers.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center">
                    {remotePeers.length + 1}
                  </span>
                )}
              </motion.button>

              {/* Chat Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowChat(!showChat)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition relative ${
                  showChat ? 'bg-cyan-600' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <MessageSquare size={20} />
                {messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center">
                    {messages.length}
                  </span>
                )}
              </motion.button>

              {/* More Options */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <MoreVertical size={20} />
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ================= RIGHT SIDEBAR (Animated) ================= */}
      <AnimatePresence>
        {(showParticipants || showChat) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col relative"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowParticipants(true); setShowChat(false); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      showParticipants ? 'bg-cyan-600' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    Participants
                  </button>
                  <button
                    onClick={() => { setShowChat(true); setShowParticipants(false); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      showChat ? 'bg-cyan-600' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    Chat
                  </button>
                </div>
                <button
                  onClick={() => { setShowParticipants(false); setShowChat(false); }}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>
              
              {showParticipants && (
                <p className="text-xs text-white/40">
                  {remotePeers.length + 1} participants
                </p>
              )}
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20">
              {showParticipants && (
                <div className="space-y-3">
                  {/* You */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <span className="text-xs font-bold">Y</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2">
                          You
                          {isHost && (
                            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] flex items-center gap-1">
                              <Crown size={8} /> Host
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-white/40 flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full bg-green-400`}></span>
                          Connected
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isMuted && <MicOff size={14} className="text-red-400" />}
                      {isVideoOff && <VideoOff size={14} className="text-red-400" />}
                    </div>
                  </div>

                  {/* Remote Participants */}
                  {remotePeers.map(peer => (
                    <motion.div
                      key={peer.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          peer.isHost ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-white/10'
                        }`}>
                          {peer.isHost ? <Crown size={14} /> : <UserIcon size={14} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {peer.isHost ? 'Host' : 'Guest'}
                          </p>
                          <p className="text-xs text-white/40 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            Connected
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {peer.isMuted && <MicOff size={14} className="text-red-400" />}
                        {peer.isVideoOff && <VideoOff size={14} className="text-red-400" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {showChat && (
                <div className="h-full flex flex-col">
                  {/* Messages Container */}
                  <div ref={chatContainerRef} className="flex-1 space-y-4 mb-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-sm text-white/40">No messages yet</p>
                        <p className="text-xs text-white/20 mt-1">Start the conversation</p>
                      </div>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id} className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{msg.sender}</span>
                            <span className="text-xs text-white/40">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm bg-white/5 p-3 rounded-lg">{msg.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="mt-auto">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyLink}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                Copy Invite Link
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MeetingPage() {
  return <Suspense fallback={
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-white/70">Loading meeting...</p>
      </div>
    </div>
  }><MeetingContent /></Suspense>;
}