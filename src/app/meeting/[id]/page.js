// "use client";
// import { useEffect, useState, Suspense, useRef } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import Script from "next/script";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Mic, MicOff, Video, VideoOff, Phone, MessageSquare, 
//   Users, Copy, MoreVertical, Settings, Share2, 
//   Maximize2, Minimize2, ScreenShare, Volume2, 
//   Crown, User as UserIcon, X, Check, ChevronLeft,
//   ChevronRight, AlertCircle, Wifi, WifiOff
// } from "lucide-react";
// import { startMeeting, stopMeeting } from "@/components/webrtc";

// function MeetingContent() {
//   const { id: roomId } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const isHost = searchParams.get("role") === "host";
  
//   const [remotePeers, setRemotePeers] = useState([]); 
//   const [activeStreamId, setActiveStreamId] = useState("local"); 
//   const [isAframeLoaded, setIsAframeLoaded] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [showParticipants, setShowParticipants] = useState(true);
//   const [showChat, setShowChat] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [connectionQuality, setConnectionQuality] = useState("good"); // good, average, poor
//   const [showControls, setShowControls] = useState(true);
//   const [activeTab, setActiveTab] = useState("participants"); // participants, chat
//   const [notification, setNotification] = useState(null);
//   const [hoveredParticipant, setHoveredParticipant] = useState(null);
  
//   const controlsTimeoutRef = useRef(null);
//   const videoRefs = useRef({});
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     if (isAframeLoaded) {
//       startMeeting(roomId, isHost, (peerId, stream, peerIsHost) => {
//         setRemotePeers(prev => {
//           if (prev.find(p => p.id === peerId)) return prev;
//           if (!isHost && peerIsHost) setActiveStreamId(peerId);
          
//           // Show notification for new participant
//           showNotification(`${peerIsHost ? 'Host' : 'Guest'} joined the meeting`);
          
//           return [...prev, { id: peerId, stream, isHost: peerIsHost, isMuted: false, isVideoOff: false }];
//         });
//       });
      
//       // Simulate connection quality changes (remove in production)
//       const interval = setInterval(() => {
//         const qualities = ["good", "average", "poor"];
//         setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
//       }, 10000);
      
//       return () => clearInterval(interval);
//     }
//     return () => { stopMeeting(); };
//   }, [isAframeLoaded, roomId, isHost]);

//   // Auto-hide controls after inactivity
//   useEffect(() => {
//     const handleMouseMove = () => {
//       setShowControls(true);
//       clearTimeout(controlsTimeoutRef.current);
//       controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       clearTimeout(controlsTimeoutRef.current);
//     };
//   }, []);

//   // Scroll chat to bottom when new message arrives
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const showNotification = (message, type = "info") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const copyLink = () => {
//     navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
//     showNotification("Invite link copied to clipboard!", "success");
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       setMessages([...messages, { id: Date.now(), text: newMessage, sender: "You", timestamp: new Date() }]);
//       setNewMessage("");
//       showNotification("Message sent", "success");
//     }
//   };

//   const toggleAudio = () => {
//     setIsMuted(!isMuted);
//     showNotification(isMuted ? "Microphone unmuted" : "Microphone muted");
//   };

//   const toggleVideo = () => {
//     setIsVideoOff(!isVideoOff);
//     showNotification(isVideoOff ? "Camera turned on" : "Camera turned off");
//   };

//   const toggleScreenShare = () => {
//     setIsScreenSharing(!isScreenSharing);
//     showNotification(isScreenSharing ? "Stopped screen sharing" : "Started screen sharing");
//   };

//   const getConnectionColor = () => {
//     switch(connectionQuality) {
//       case "good": return "text-green-400";
//       case "average": return "text-yellow-400";
//       case "poor": return "text-red-400";
//       default: return "text-green-400";
//     }
//   };

//   return (
//     <div className="h-screen w-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex overflow-hidden">
      
//       <Script
//         src="https://aframe.io/releases/1.5.0/aframe.min.js"
//         onLoad={() => setIsAframeLoaded(true)}
//       />

//       {/* Notification Toast */}
//       <AnimatePresence>
//         {notification && (
//           <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -50 }}
//             className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 ${
//               notification.type === "success" ? "bg-green-600" : 
//               notification.type === "error" ? "bg-red-600" : "bg-blue-600"
//             }`}
//           >
//             {notification.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
//             <span className="text-sm font-medium">{notification.message}</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="flex-1 flex flex-col relative">
        
//         {/* ======= TOP NAVBAR (Glassmorphic) ======= */}
//         <motion.div 
//           initial={{ y: -100 }}
//           animate={{ y: showControls ? 0 : -100 }}
//           transition={{ duration: 0.3 }}
//           className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10"
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
//               <span className="text-lg font-bold">H</span>
//             </div>
//             <div>
//               <h1 className="text-sm font-semibold flex items-center gap-2">
//                 Business Weekly Meeting
//                 {isHost && (
//                   <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs flex items-center gap-1">
//                     <Crown size={12} /> Host
//                   </span>
//                 )}
//               </h1>
//               <p className="text-xs text-white/40">Room: {roomId.slice(0, 8)}...</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Connection Quality Indicator */}
//             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
//               <Wifi className={`w-4 h-4 ${getConnectionColor()}`} />
//               <span className="text-xs capitalize">{connectionQuality}</span>
//             </div>

//             {/* Timer */}
//             <div className="px-3 py-1.5 bg-white/5 rounded-lg">
//               <span className="text-xs font-mono">00:15:23</span>
//             </div>

//             {/* Fullscreen Toggle */}
//             <button
//               onClick={toggleFullscreen}
//               className="p-2 hover:bg-white/10 rounded-lg transition"
//             >
//               {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
//             </button>
//           </div>
//         </motion.div>

//         {/* ======= MAIN VIDEO AREA ======= */}
//         <div className="flex-1 relative bg-black overflow-hidden">
          
//           {isAframeLoaded ? (
//             <a-scene
//               embedded
//               style={{ height: "100%", width: "100%" }}
//               vr-mode-ui="enabled: false"
//               renderer="antialias: true; colorManagement: true;"
//             >
//               <a-assets>
//                 {remotePeers.map(p => (
//                   <video
//                     key={p.id}
//                     id={`vid-${p.id}`}
//                     autoPlay
//                     playsInline
//                     ref={el => { if (el) { el.srcObject = p.stream; videoRefs.current[p.id] = el; } }}
//                   />
//                 ))}
//               </a-assets>

//               <a-videosphere
//                 src={
//                   activeStreamId === "local"
//                     ? "#localVideo"
//                     : `#vid-${activeStreamId}`
//                 }
//                 rotation="0 -90 0"
//                 material="shader: flat; side: double;"
//               />

//               <a-camera look-controls="pointerLockEnabled: false" wasd-controls="enabled: false" />
//             </a-scene>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <div className="text-center">
//                 <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                 <p className="text-lg font-semibold text-white/70">Connecting to 360° environment...</p>
//               </div>
//             </div>
//           )}

//           {/* ===== Connection Status Overlay ===== */}
//           {connectionQuality === "poor" && (
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-lg px-4 py-2 rounded-full text-sm flex items-center gap-2"
//             >
//               <WifiOff size={16} />
//               <span>Poor connection quality</span>
//             </motion.div>
//           )}

//           {/* ===== Floating Participants Thumbnails ===== */}
//           <motion.div 
//             initial={{ y: 100 }}
//             animate={{ y: showControls ? 0 : 100 }}
//             transition={{ duration: 0.3 }}
//             className="absolute bottom-24 left-0 right-0 px-6 z-10"
//           >
//             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
//               {/* Local */}
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setActiveStreamId("local")}
//                 className={`relative min-w-40 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
//                   activeStreamId === "local"
//                     ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
//                     : "border-white/10 hover:border-white/30"
//                 }`}
//               >
//                 <video
//                   id="localVideo"
//                   autoPlay
//                   muted
//                   playsInline
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
//                   <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
//                     <UserIcon size={10} />
//                     <span>You</span>
//                   </div>
//                   <div className="flex gap-1">
//                     {isMuted && <MicOff size={10} className="text-red-400" />}
//                     {isVideoOff && <VideoOff size={10} className="text-red-400" />}
//                   </div>
//                 </div>
//                 {hoveredParticipant === "local" && (
//                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                     <Maximize2 size={20} className="text-white/70" />
//                   </div>
//                 )}
//               </motion.div>

//               {remotePeers.map(peer => (
//                 <motion.div
//                   key={peer.id}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onHoverStart={() => setHoveredParticipant(peer.id)}
//                   onHoverEnd={() => setHoveredParticipant(null)}
//                   onClick={() => setActiveStreamId(peer.id)}
//                   className={`relative min-w-40 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
//                     activeStreamId === peer.id
//                       ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
//                       : "border-white/10 hover:border-white/30"
//                   }`}
//                 >
//                   <video
//                     autoPlay
//                     playsInline
//                     ref={el => { if (el) { el.srcObject = peer.stream; videoRefs.current[peer.id] = el; } }}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
//                   <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
//                     <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
//                       {peer.isHost ? <Crown size={10} className="text-amber-400" /> : <UserIcon size={10} />}
//                       <span>{peer.isHost ? "Host" : "Guest"}</span>
//                     </div>
//                     <div className="flex gap-1">
//                       {peer.isMuted && <MicOff size={10} className="text-red-400" />}
//                       {peer.isVideoOff && <VideoOff size={10} className="text-red-400" />}
//                     </div>
//                   </div>
//                   {hoveredParticipant === peer.id && (
//                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                       <Maximize2 size={20} className="text-white/70" />
//                     </div>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* ===== Floating Controls ===== */}
//           <motion.div 
//             initial={{ y: 100 }}
//             animate={{ y: showControls ? 0 : 100 }}
//             transition={{ duration: 0.3 }}
//             className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
//           >
//             <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
//               {/* Audio Toggle */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleAudio}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
//                   isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
//                 }`}
//               >
//                 {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
//               </motion.button>

//               {/* Video Toggle */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleVideo}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
//                   isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
//                 }`}
//               >
//                 {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
//               </motion.button>

//               {/* Screen Share */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleScreenShare}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
//                   isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-white/10 hover:bg-white/20'
//                 }`}
//               >
//                 <ScreenShare size={20} />
//               </motion.button>

//               {/* Leave Call */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => { stopMeeting(); router.push("/"); }}
//                 className="w-14 h-14 rounded-xl bg-red-600 hover:bg-red-700 flex items-center justify-center transition shadow-lg shadow-red-600/20"
//               >
//                 <Phone size={24} className="rotate-135" />
//               </motion.button>

//               {/* Participants Toggle */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setShowParticipants(!showParticipants)}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition relative ${
//                   showParticipants ? 'bg-cyan-600' : 'bg-white/10 hover:bg-white/20'
//                 }`}
//               >
//                 <Users size={20} />
//                 {remotePeers.length > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center">
//                     {remotePeers.length + 1}
//                   </span>
//                 )}
//               </motion.button>

//               {/* Chat Toggle */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setShowChat(!showChat)}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition relative ${
//                   showChat ? 'bg-cyan-600' : 'bg-white/10 hover:bg-white/20'
//                 }`}
//               >
//                 <MessageSquare size={20} />
//                 {messages.length > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center">
//                     {messages.length}
//                   </span>
//                 )}
//               </motion.button>

//               {/* More Options */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
//               >
//                 <MoreVertical size={20} />
//               </motion.button>
//             </div>
//           </motion.div>

//         </div>
//       </div>

//       {/* ================= RIGHT SIDEBAR (Animated) ================= */}
//       <AnimatePresence>
//         {(showParticipants || showChat) && (
//           <motion.div
//             initial={{ width: 0, opacity: 0 }}
//             animate={{ width: 320, opacity: 1 }}
//             exit={{ width: 0, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col relative"
//           >
//             {/* Sidebar Header */}
//             <div className="p-6 border-b border-white/10">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => { setShowParticipants(true); setShowChat(false); }}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                       showParticipants ? 'bg-cyan-600' : 'bg-white/5 hover:bg-white/10'
//                     }`}
//                   >
//                     Participants
//                   </button>
//                   <button
//                     onClick={() => { setShowChat(true); setShowParticipants(false); }}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                       showChat ? 'bg-cyan-600' : 'bg-white/5 hover:bg-white/10'
//                     }`}
//                   >
//                     Chat
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => { setShowParticipants(false); setShowChat(false); }}
//                   className="p-2 hover:bg-white/10 rounded-lg transition"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
              
//               {showParticipants && (
//                 <p className="text-xs text-white/40">
//                   {remotePeers.length + 1} participants
//                 </p>
//               )}
//             </div>

//             {/* Sidebar Content */}
//             <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20">
//               {showParticipants && (
//                 <div className="space-y-3">
//                   {/* You */}
//                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
//                         <span className="text-xs font-bold">Y</span>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium flex items-center gap-2">
//                           You
//                           {isHost && (
//                             <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] flex items-center gap-1">
//                               <Crown size={8} /> Host
//                             </span>
//                           )}
//                         </p>
//                         <p className="text-xs text-white/40 flex items-center gap-1">
//                           <span className={`w-2 h-2 rounded-full bg-green-400`}></span>
//                           Connected
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       {isMuted && <MicOff size={14} className="text-red-400" />}
//                       {isVideoOff && <VideoOff size={14} className="text-red-400" />}
//                     </div>
//                   </div>

//                   {/* Remote Participants */}
//                   {remotePeers.map(peer => (
//                     <motion.div
//                       key={peer.id}
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                           peer.isHost ? 'bg-linear-to-br from-amber-500 to-orange-600' : 'bg-white/10'
//                         }`}>
//                           {peer.isHost ? <Crown size={14} /> : <UserIcon size={14} />}
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium">
//                             {peer.isHost ? 'Host' : 'Guest'}
//                           </p>
//                           <p className="text-xs text-white/40 flex items-center gap-1">
//                             <span className="w-2 h-2 rounded-full bg-green-400"></span>
//                             Connected
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         {peer.isMuted && <MicOff size={14} className="text-red-400" />}
//                         {peer.isVideoOff && <VideoOff size={14} className="text-red-400" />}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}

//               {showChat && (
//                 <div className="h-full flex flex-col">
//                   {/* Messages Container */}
//                   <div ref={chatContainerRef} className="flex-1 space-y-4 mb-4">
//                     {messages.length === 0 ? (
//                       <div className="text-center py-8">
//                         <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
//                         <p className="text-sm text-white/40">No messages yet</p>
//                         <p className="text-xs text-white/20 mt-1">Start the conversation</p>
//                       </div>
//                     ) : (
//                       messages.map(msg => (
//                         <div key={msg.id} className="flex flex-col">
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="text-sm font-medium">{msg.sender}</span>
//                             <span className="text-xs text-white/40">
//                               {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </span>
//                           </div>
//                           <p className="text-sm bg-white/5 p-3 rounded-lg">{msg.text}</p>
//                         </div>
//                       ))
//                     )}
//                   </div>

//                   {/* Message Input */}
//                   <form onSubmit={sendMessage} className="mt-auto">
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder="Type a message..."
//                         className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition"
//                       />
//                       <button
//                         type="submit"
//                         className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition"
//                       >
//                         <MessageSquare size={18} />
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               )}
//             </div>

//             {/* Sidebar Footer */}
//             <div className="p-6 border-t border-white/10">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={copyLink}
//                 className="w-full bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
//               >
//                 <Copy size={16} />
//                 Copy Invite Link
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default function MeetingPage() {
//   return <Suspense fallback={
//     <div className="h-screen w-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//       <div className="text-center">
//         <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//         <p className="text-lg font-semibold text-white/70">Loading meeting...</p>
//       </div>
//     </div>
//   }><MeetingContent /></Suspense>;
// }




















"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageSquare,
  Users,
  Copy,
  MoreVertical,
  Settings,
  Share2,
  Maximize2,
  Minimize2,
  ScreenShare,
  Volume2,
  Crown,
  User as UserIcon,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { startMeeting, stopMeeting } from "@/components/webrtc";

function MeetingContent() {
  const [viewMode, setViewMode] = useState("360"); // "360" or "normal"
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
        setRemotePeers((prev) => {
          if (prev.find((p) => p.id === peerId)) return prev;
          if (!isHost && peerIsHost) setActiveStreamId(peerId);

          // Show notification for new participant
          showNotification(
            `${peerIsHost ? "Host" : "Guest"} joined the meeting`
          );

          return [
            ...prev,
            {
              id: peerId,
              stream,
              isHost: peerIsHost,
              isMuted: false,
              isVideoOff: false,
            },
          ];
        });
      });

      // Simulate connection quality changes (remove in production)
      const interval = setInterval(() => {
        const qualities = ["good", "average", "poor"];
        setConnectionQuality(
          qualities[Math.floor(Math.random() * qualities.length)]
        );
      }, 10000);

      return () => clearInterval(interval);
    }
    return () => {
      stopMeeting();
    };
  }, [isAframeLoaded, roomId, isHost]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(
        () => setShowControls(false),
        3000
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Scroll chat to bottom when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/meeting/${roomId}`
    );
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
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text: newMessage,
          sender: "You",
          timestamp: new Date(),
        },
      ]);
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
    showNotification(
      isScreenSharing ? "Stopped screen sharing" : "Started screen sharing"
    );
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case "good":
        return "text-green-400";
      case "average":
        return "text-yellow-400";
      case "poor":
        return "text-red-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <div className="h-screen w-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex overflow-hidden">
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
              notification.type === "success"
                ? "bg-green-600"
                : notification.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {notification.type === "success" ? (
              <Check size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
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
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
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
              <p className="text-xs text-white/40">
                Room: {roomId.slice(0, 8)}...
              </p>
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
        {/* ======= MAIN VIDEO AREA ======= */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {/* View Mode Toggle Button (Top Right of Video) */}
          <div className="absolute top-24 right-6 z-30">
            <button
              onClick={() => setViewMode(viewMode === "360" ? "normal" : "360")}
              className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition shadow-2xl"
            >
              {viewMode === "360" ? (
                <>
                  <Video size={18} className="text-cyan-400" />{" "}
                  <span className="text-xs font-medium">Switch to Normal</span>
                </>
              ) : (
                <>
                  <Maximize2 size={18} className="text-purple-400" />{" "}
                  <span className="text-xs font-medium">Switch to 360°</span>
                </>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === "360" ? (
              <motion.div
                key="360view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full"
              >
                {isAframeLoaded ? (
                  <a-scene
                    embedded
                    style={{ height: "100%", width: "100%" }}
                    vr-mode-ui="enabled: false"
                  >
                    <a-assets>
                      {remotePeers.map((p) => (
                        <video
                          key={p.id}
                          id={`vid-${p.id}`}
                          autoPlay
                          playsInline
                          ref={(el) => {
                            if (el) {
                              el.srcObject = p.stream;
                              videoRefs.current[p.id] = el;
                            }
                          }}
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
                    />
                    <a-camera
                      look-controls="pointerLockEnabled: false"
                      wasd-controls="enabled: false"
                    />
                  </a-scene>
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-900">
                    <div className="animate-pulse text-white/50">
                      Loading 360° Scene...
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="normalView"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full flex items-center justify-center bg-slate-950"
              >
                <video
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  ref={(el) => {
                    if (el) {
                      // 1. Find the stream data
                      const activePeer = remotePeers.find(
                        (p) => p.id === activeStreamId
                      );
                      const streamToDisplay =
                        activeStreamId === "local"
                          ? videoRefs.current["local"]?.srcObject || // Try to get from existing local ref
                            document.getElementById("localVideo")?.srcObject // Fallback to DOM
                          : activePeer?.stream;

                      // 2. Assign it
                      if (streamToDisplay && el.srcObject !== streamToDisplay) {
                        el.srcObject = streamToDisplay;
                      }
                    }
                  }}
                />
                <div className="absolute bottom-10 left-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 z-20">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Standard View:{" "}
                    {activeStreamId === "local"
                      ? "You (Local Preview)"
                      : "Participant"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                className={`relative min-w-40 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
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
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
                    <UserIcon size={10} />
                    <span>You</span>
                  </div>
                  <div className="flex gap-1">
                    {isMuted && <MicOff size={10} className="text-red-400" />}
                    {isVideoOff && (
                      <VideoOff size={10} className="text-red-400" />
                    )}
                  </div>
                </div>
                {hoveredParticipant === "local" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Maximize2 size={20} className="text-white/70" />
                  </div>
                )}
              </motion.div>

              {remotePeers.map((peer) => (
                <motion.div
                  key={peer.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredParticipant(peer.id)}
                  onHoverEnd={() => setHoveredParticipant(null)}
                  onClick={() => setActiveStreamId(peer.id)}
                  className={`relative min-w-40 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                    activeStreamId === peer.id
                      ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <video
                    autoPlay
                    playsInline
                    ref={(el) => {
                      if (el) {
                        el.srcObject = peer.stream;
                        videoRefs.current[peer.id] = el;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
                      {peer.isHost ? (
                        <Crown size={10} className="text-amber-400" />
                      ) : (
                        <UserIcon size={10} />
                      )}
                      <span>{peer.isHost ? "Host" : "Guest"}</span>
                    </div>
                    <div className="flex gap-1">
                      {peer.isMuted && (
                        <MicOff size={10} className="text-red-400" />
                      )}
                      {peer.isVideoOff && (
                        <VideoOff size={10} className="text-red-400" />
                      )}
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
                  isMuted
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-white/10 hover:bg-white/20"
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
                  isVideoOff
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-white/10 hover:bg-white/20"
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
                  isScreenSharing
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <ScreenShare size={20} />
              </motion.button>

              {/* Leave Call */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  stopMeeting();
                  router.push("/");
                }}
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
                  showParticipants
                    ? "bg-cyan-600"
                    : "bg-white/10 hover:bg-white/20"
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
                  showChat ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"
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

          {/* Connection Quality, Thumbnails, and Controls remain here... */}
        </div>
        {/* <div className="flex-1 relative bg-black overflow-hidden">
          
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

          

        </div> */}
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
                    onClick={() => {
                      setShowParticipants(true);
                      setShowChat(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      showParticipants
                        ? "bg-cyan-600"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    Participants
                  </button>
                  <button
                    onClick={() => {
                      setShowChat(true);
                      setShowParticipants(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      showChat ? "bg-cyan-600" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    Chat
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowParticipants(false);
                    setShowChat(false);
                  }}
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
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
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
                          <span
                            className={`w-2 h-2 rounded-full bg-green-400`}
                          ></span>
                          Connected
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isMuted && <MicOff size={14} className="text-red-400" />}
                      {isVideoOff && (
                        <VideoOff size={14} className="text-red-400" />
                      )}
                    </div>
                  </div>

                  {/* Remote Participants */}
                  {remotePeers.map((peer) => (
                    <motion.div
                      key={peer.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            peer.isHost
                              ? "bg-linear-to-br from-amber-500 to-orange-600"
                              : "bg-white/10"
                          }`}
                        >
                          {peer.isHost ? (
                            <Crown size={14} />
                          ) : (
                            <UserIcon size={14} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {peer.isHost ? "Host" : "Guest"}
                          </p>
                          <p className="text-xs text-white/40 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            Connected
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {peer.isMuted && (
                          <MicOff size={14} className="text-red-400" />
                        )}
                        {peer.isVideoOff && (
                          <VideoOff size={14} className="text-red-400" />
                        )}
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
                        <p className="text-xs text-white/20 mt-1">
                          Start the conversation
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {msg.sender}
                            </span>
                            <span className="text-xs text-white/40">
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm bg-white/5 p-3 rounded-lg">
                            {msg.text}
                          </p>
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
                className="w-full bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
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
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-white/70">
              Loading meeting...
            </p>
          </div>
        </div>
      }
    >
      <MeetingContent />
    </Suspense>
  );
}