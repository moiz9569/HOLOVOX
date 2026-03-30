// "use client";
// import { useEffect, useState, Suspense, useRef } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import Script from "next/script";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   Phone,
//   MessageSquare,
//   Users,
//   Copy,
//   MoreVertical,
//   Maximize2,
//   Minimize2,
//   ScreenShare,
//   Crown,
//   User as UserIcon,
//   X,
//   Check,
//   AlertCircle,
//   WifiOff,
//   ThumbsUp,
//   Smile,
//   Heart,
//   Laugh,
//   Frown,
//   Settings,
//   Shield,
//   Lock,
//   Eye,
//   EyeOff,
//   Edit,
//   LogOut,
//   Flag,
//   Trash2,
//   Paintbrush,
//   PenTool,
//   Eraser,
//   Square,
//   Circle,
//   Type,
//   Undo,
//   Redo,
//   Download,
//   Upload,
//   ChevronDown,
//   ChevronUp,
//   ShieldAlert,
//   UserMinus,
// } from "lucide-react";
// import { startMeeting, stopMeeting } from "@/components/webrtc";

// function MeetingContent() {
//   const [viewMode, setViewMode] = useState("360"); // "360" or "normal"
//   const { id: roomId } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const isHost = searchParams.get("role") === "host";

//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);
//   const recordingStreamRef = useRef(null);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: true,
//       });

//       recordingStreamRef.current = stream;

//       const mediaRecorder = new MediaRecorder(stream);

//       mediaRecorderRef.current = mediaRecorder;
//       recordedChunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           recordedChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Recording error:", error);
//     }
//   };

//   const stopRecording = () => {
//     const mediaRecorder = mediaRecorderRef.current;

//     if (!mediaRecorder) return;

//     mediaRecorder.stop();

//     mediaRecorder.onstop = () => {
//       const blob = new Blob(recordedChunksRef.current, {
//         type: "video/webm",
//       });

//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `holovox-meeting-${Date.now()}.webm`;
//       a.click();

//       recordedChunksRef.current = [];

//       if (recordingStreamRef.current) {
//         recordingStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };

//     setIsRecording(false);
//   };

//   const [remotePeers, setRemotePeers] = useState([]);
//   const [activeStreamId, setActiveStreamId] = useState("local");
//   const [isAframeLoaded, setIsAframeLoaded] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [showParticipants, setShowParticipants] = useState(true);
//   const [showChat, setShowChat] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [connectionQuality, setConnectionQuality] = useState("good");
//   const [showControls, setShowControls] = useState(true);
//   const [notification, setNotification] = useState(null);
//   const [hoveredParticipant, setHoveredParticipant] = useState(null);

//   // New state variables
//   const [showReactions, setShowReactions] = useState(false);
//   const [reactions, setReactions] = useState([]);
//   const [showWhiteboard, setShowWhiteboard] = useState(false);
//   const [whiteboardMode, setWhiteboardMode] = useState("draw"); // draw, text, erase
//   const [whiteboardColor, setWhiteboardColor] = useState("#E62064");
//   const [whiteboardData, setWhiteboardData] = useState([]);
//   const [showSettings, setShowSettings] = useState(false);
//   const [showSecurity, setShowSecurity] = useState(false);
//   const [meetingLocked, setMeetingLocked] = useState(false);
//   const [hideProfilePictures, setHideProfilePictures] = useState(false);
//   const [permissions, setPermissions] = useState({
//     chat: true,
//     shareScreen: true,
//     startVideo: true,
//     shareWhiteboard: true,
//     renameSelf: true,
//   });
//   const [participantNames, setParticipantNames] = useState({});
//   const [showMoreMenu, setShowMoreMenu] = useState(null);

//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);
//   const isDrawingRef = useRef(false);
//   const controlsTimeoutRef = useRef(null);
//   const videoRefs = useRef({});
//   const chatContainerRef = useRef(null);
//   const reactionsTimeoutRef = useRef(null);

//   useEffect(() => {
//     if (isAframeLoaded) {
//       startMeeting(roomId, isHost, (peerId, stream, peerIsHost) => {
//         setRemotePeers((prev) => {
//           if (prev.find((p) => p.id === peerId)) return prev;
//           if (!isHost && peerIsHost) setActiveStreamId(peerId);
//           showNotification(
//             `${peerIsHost ? "Host" : "Guest"} joined the meeting`,
//           );
//           return [
//             ...prev,
//             {
//               id: peerId,
//               stream,
//               isHost: peerIsHost,
//               isMuted: false,
//               isVideoOff: false,
//               name: `Participant ${prev.length + 1}`,
//             },
//           ];
//         });
//       });

//       const interval = setInterval(() => {
//         const qualities = ["good", "average", "poor"];
//         setConnectionQuality(
//           qualities[Math.floor(Math.random() * qualities.length)],
//         );
//       }, 10000);

//       return () => clearInterval(interval);
//     }
//     return () => {
//       stopMeeting();
//     };
//   }, [isAframeLoaded, roomId, isHost]);

//   // Auto-hide controls
//   useEffect(() => {
//     const handleMouseMove = () => {
//       setShowControls(true);
//       clearTimeout(controlsTimeoutRef.current);
//       controlsTimeoutRef.current = setTimeout(
//         () => setShowControls(false),
//         3000,
//       );
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       clearTimeout(controlsTimeoutRef.current);
//     };
//   }, []);

//   // Scroll chat to bottom
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Initialize whiteboard
//   useEffect(() => {
//     if (showWhiteboard && canvasRef.current) {
//       const canvas = canvasRef.current;
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvas.offsetHeight;
//       const ctx = canvas.getContext("2d");
//       ctx.strokeStyle = whiteboardColor;
//       ctx.lineWidth = 2;
//       ctx.lineCap = "round";
//       ctxRef.current = ctx;
//     }
//   }, [showWhiteboard, whiteboardColor]);

//   const showNotification = (message, type = "info") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const copyLink = () => {
//     navigator.clipboard.writeText(
//       `https://holovox-jade.vercel.app/meeting/${roomId}`,
//     );
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
//     if (newMessage.trim() && permissions.chat) {
//       setMessages([
//         ...messages,
//         {
//           id: Date.now(),
//           text: newMessage,
//           sender: "You",
//           timestamp: new Date(),
//         },
//       ]);
//       setNewMessage("");
//       showNotification("Message sent", "success");
//     } else if (!permissions.chat) {
//       showNotification("Chat is disabled by host", "error");
//     }
//   };

//   const toggleAudio = () => {
//     setIsMuted(!isMuted);
//     showNotification(isMuted ? "Microphone unmuted" : "Microphone muted");
//   };

//   const toggleVideo = () => {
//     if (permissions.startVideo || isHost) {
//       setIsVideoOff(!isVideoOff);
//       showNotification(isVideoOff ? "Camera turned on" : "Camera turned off");
//     } else {
//       showNotification("Video is disabled by host", "error");
//     }
//   };

//   const toggleScreenShare = () => {
//     if (permissions.shareScreen || isHost) {
//       setIsScreenSharing(!isScreenSharing);
//       showNotification(
//         isScreenSharing ? "Stopped screen sharing" : "Started screen sharing",
//       );
//     } else {
//       showNotification("Screen sharing is disabled by host", "error");
//     }
//   };

//   // Reaction Functions
//   const addReaction = (reactionType) => {
//     const reaction = {
//       id: Date.now(),
//       type: reactionType,
//       sender: "You",
//       timestamp: new Date(),
//     };
//     setReactions([...reactions, reaction]);
//     showNotification(`You sent a ${reactionType} reaction`);
//     setShowReactions(false);

//     // Auto-hide reaction after 3 seconds
//     setTimeout(() => {
//       setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
//     }, 3000);
//   };

//   const getReactionIcon = (type) => {
//     switch (type) {
//       case "thumbsup":
//         return <ThumbsUp size={24} className="text-yellow-400" />;
//       case "smile":
//         return <Smile size={24} className="text-yellow-400" />;
//       case "heart":
//         return <Heart size={24} className="text-red-400" />;
//       case "laugh":
//         return <Laugh size={24} className="text-yellow-400" />;
//       case "frown":
//         return <Frown size={24} className="text-yellow-400" />;
//       default:
//         return <Smile size={24} className="text-yellow-400" />;
//     }
//   };

//   // Whiteboard Functions
//   const startDrawing = (e) => {
//     if (whiteboardMode === "draw" || whiteboardMode === "erase") {
//       isDrawingRef.current = true;
//       const rect = canvasRef.current.getBoundingClientRect();
//       const x =
//         (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
//       const y =
//         (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
//       ctxRef.current.beginPath();
//       ctxRef.current.moveTo(x, y);
//     }
//   };

//   const draw = (e) => {
//     if (!isDrawingRef.current) return;
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
//     const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);

//     if (whiteboardMode === "erase") {
//       ctxRef.current.globalCompositeOperation = "destination-out";
//       ctxRef.current.lineWidth = 20;
//     } else {
//       ctxRef.current.globalCompositeOperation = "source-over";
//       ctxRef.current.strokeStyle = whiteboardColor;
//       ctxRef.current.lineWidth = 2;
//     }

//     ctxRef.current.lineTo(x, y);
//     ctxRef.current.stroke();
//     ctxRef.current.beginPath();
//     ctxRef.current.moveTo(x, y);
//   };

//   const stopDrawing = () => {
//     isDrawingRef.current = false;
//     // Save drawing state
//     const imageData = canvasRef.current.toDataURL();
//     setWhiteboardData([...whiteboardData, imageData]);
//   };

//   const clearWhiteboard = () => {
//     if (ctxRef.current) {
//       ctxRef.current.clearRect(
//         0,
//         0,
//         canvasRef.current.width,
//         canvasRef.current.height,
//       );
//       setWhiteboardData([]);
//       showNotification("Whiteboard cleared", "success");
//     }
//   };

//   const downloadWhiteboard = () => {
//     const link = document.createElement("a");
//     link.download = "whiteboard.png";
//     link.href = canvasRef.current.toDataURL();
//     link.click();
//     showNotification("Whiteboard downloaded", "success");
//   };

//   // Security Functions
//   const toggleMeetingLock = () => {
//     setMeetingLocked(!meetingLocked);
//     showNotification(
//       meetingLocked
//         ? "Meeting unlocked"
//         : "Meeting locked - No new participants can join",
//     );
//   };

//   const toggleHideProfilePictures = () => {
//     setHideProfilePictures(!hideProfilePictures);
//     showNotification(
//       hideProfilePictures
//         ? "Profile pictures visible"
//         : "Profile pictures hidden",
//     );
//   };

//   // Permission Functions (Host only)
//   const updatePermissions = (permission, value) => {
//     if (isHost) {
//       setPermissions({ ...permissions, [permission]: value });
//       showNotification(
//         `${permission} ${value ? "enabled" : "disabled"}`,
//         "success",
//       );
//     }
//   };

//   // Participant Management (Host only)
//   const removeParticipant = (peerId) => {
//     if (isHost) {
//       setRemotePeers((prev) => prev.filter((p) => p.id !== peerId));
//       showNotification("Participant removed from meeting", "success");
//       // In real implementation, you'd send a signal to disconnect the peer
//     }
//   };

//   const renameParticipant = (peerId, newName) => {
//     if (permissions.renameSelf || isHost) {
//       setRemotePeers((prev) =>
//         prev.map((p) => (p.id === peerId ? { ...p, name: newName } : p)),
//       );
//       setParticipantNames({ ...participantNames, [peerId]: newName });
//       showNotification("Name updated successfully", "success");
//     } else {
//       showNotification("Renaming is disabled by host", "error");
//     }
//   };

//   const endMeeting = () => {
//     if (isHost) {
//       // In real implementation, you'd disconnect all participants
//       showNotification("Ending meeting for everyone...", "info");
//       setTimeout(() => {
//         stopMeeting();
//         router.push("/home");
//       }, 1000);
//     }
//   };

//   const leaveMeeting = () => {
//     stopMeeting();
//     router.push("/home");
//   };

//   const getConnectionColor = () => {
//     switch (connectionQuality) {
//       case "good":
//         return "text-green-400";
//       case "average":
//         return "text-yellow-400";
//       case "poor":
//         return "text-red-400";
//       default:
//         return "text-green-400";
//     }
//   };

//   return (
//     <div className="h-screen w-screen bg-slate-700 text-white flex overflow-hidden">
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
//               notification.type === "success"
//                 ? "bg-green-600"
//                 : notification.type === "error"
//                   ? "bg-red-600"
//                   : "bg-blue-600"
//             }`}
//           >
//             {notification.type === "success" ? (
//               <Check size={18} />
//             ) : (
//               <AlertCircle size={18} />
//             )}
//             <span className="text-sm font-medium">{notification.message}</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Floating Reactions */}
//       <div className="fixed top-20 right-20 z-50 space-y-2">
//         {reactions.map((reaction) => (
//           <motion.div
//             key={reaction.id}
//             initial={{ opacity: 0, y: 20, scale: 0.5 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="bg-black/60 backdrop-blur-lg rounded-full p-3"
//           >
//             {getReactionIcon(reaction.type)}
//           </motion.div>
//         ))}
//       </div>

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="flex-1 flex flex-col relative">
//         {/* ======= TOP NAVBAR ======= */}
//         <motion.div
//           initial={{ y: -100 }}
//           animate={{ y: showControls ? 0 : -100 }}
//           transition={{ duration: 0.3 }}
//           className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10"
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#E62064] to-[#E62064]/40 flex items-center justify-center">
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
//                 {meetingLocked && (
//                   <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1">
//                     <Lock size={10} /> Locked
//                   </span>
//                 )}
//               </h1>
//               <p className="text-xs text-white/80">Room: {roomId}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="px-3 py-1.5 bg-white/5 rounded-lg">
//               <span className="text-xs font-mono">00:15:23</span>
//             </div>
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
//           {/* View Mode Toggle */}
//           <div className="absolute top-24 right-6 z-30">
//             <button
//               onClick={() => setViewMode(viewMode === "360" ? "normal" : "360")}
//               className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition shadow-2xl"
//             >
//               {viewMode === "360" ? (
//                 <>
//                   <Video size={18} className="text-cyan-400" />
//                   <span className="text-xs font-medium">Switch to Normal</span>
//                 </>
//               ) : (
//                 <>
//                   <Maximize2 size={18} className="text-purple-400" />
//                   <span className="text-xs font-medium">Switch to 360°</span>
//                 </>
//               )}
//             </button>
//           </div>

//           <AnimatePresence mode="wait">
//             {viewMode === "360" ? (
//               <motion.div
//                 key="360view"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="h-full w-full"
//               >
//                 {isAframeLoaded ? (
//                   <a-scene
//                     embedded
//                     style={{ height: "100%", width: "100%" }}
//                     vr-mode-ui="enabled: false"
//                   >
//                     <a-assets>
//                       {remotePeers.map((p) => (
//                         <video
//                           key={p.id}
//                           id={`vid-${p.id}`}
//                           autoPlay
//                           playsInline
//                           ref={(el) => {
//                             if (el) {
//                               el.srcObject = p.stream;
//                               videoRefs.current[p.id] = el;
//                             }
//                           }}
//                         />
//                       ))}
//                     </a-assets>
//                     <a-videosphere
//                       src={
//                         activeStreamId === "local"
//                           ? "#localVideo"
//                           : `#vid-${activeStreamId}`
//                       }
//                       rotation="0 -90 0"
//                     />
//                     <a-camera
//                       look-controls="pointerLockEnabled: false"
//                       wasd-controls="enabled: false"
//                     />
//                   </a-scene>
//                 ) : (
//                   <div className="h-full flex items-center justify-center bg-slate-900">
//                     <div className="animate-pulse text-white/50">
//                       Loading 360° Scene...
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="normalView"
//                 initial={{ opacity: 0, scale: 1.05 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="h-full w-full flex items-center justify-center bg-slate-950"
//               >
//                 <video
//                   autoPlay
//                   playsInline
//                   className="w-full h-full object-cover"
//                   ref={(el) => {
//                     if (el) {
//                       const activePeer = remotePeers.find(
//                         (p) => p.id === activeStreamId,
//                       );
//                       const streamToDisplay =
//                         activeStreamId === "local"
//                           ? videoRefs.current["local"]?.srcObject ||
//                             document.getElementById("localVideo")?.srcObject
//                           : activePeer?.stream;
//                       if (streamToDisplay && el.srcObject !== streamToDisplay) {
//                         el.srcObject = streamToDisplay;
//                       }
//                     }
//                   }}
//                 />
//                 <div className="absolute bottom-10 left-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 z-20">
//                   <p className="text-sm font-medium flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//                     Standard View:{" "}
//                     {activeStreamId === "local"
//                       ? "You (Local Preview)"
//                       : "Participant"}
//                   </p>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Whiteboard Overlay */}
//           <AnimatePresence>
//             {showWhiteboard && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="absolute inset-0 z-40 bg-black/90 backdrop-blur-lg flex flex-col"
//               >
//                 {/* Whiteboard Toolbar */}
//                 <div className="bg-black/60 backdrop-blur-xl p-4 flex items-center gap-3 border-b border-white/10">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setWhiteboardMode("draw")}
//                       className={`p-2 rounded-lg transition ${whiteboardMode === "draw" ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"}`}
//                     >
//                       <PenTool size={18} />
//                     </button>
//                     <button
//                       onClick={() => setWhiteboardMode("erase")}
//                       className={`p-2 rounded-lg transition ${whiteboardMode === "erase" ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"}`}
//                     >
//                       <Eraser size={18} />
//                     </button>
//                     <input
//                       type="color"
//                       value={whiteboardColor}
//                       onChange={(e) => setWhiteboardColor(e.target.value)}
//                       className="w-8 h-8 rounded cursor-pointer"
//                     />
//                     <button
//                       onClick={clearWhiteboard}
//                       className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                     <button
//                       onClick={downloadWhiteboard}
//                       className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
//                     >
//                       <Download size={18} />
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => setShowWhiteboard(false)}
//                     className="ml-auto p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
//                   >
//                     <X size={18} />
//                   </button>
//                 </div>
//                 <canvas
//                   ref={canvasRef}
//                   onMouseDown={startDrawing}
//                   onMouseMove={draw}
//                   onMouseUp={stopDrawing}
//                   onMouseLeave={stopDrawing}
//                   className="flex-1 cursor-crosshair"
//                   style={{ touchAction: "none" }}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Floating Participants Thumbnails */}
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
//                     {!hideProfilePictures && <UserIcon size={10} />}
//                     <span>{participantNames["local"] || "You"}</span>
//                   </div>
//                   <div className="flex gap-1">
//                     {isMuted && <MicOff size={10} className="text-red-400" />}
//                     {isVideoOff && (
//                       <VideoOff size={10} className="text-red-400" />
//                     )}
//                   </div>
//                 </div>
//               </motion.div>

//               {remotePeers.map((peer) => (
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
//                     ref={(el) => {
//                       if (el) {
//                         el.srcObject = peer.stream;
//                         videoRefs.current[peer.id] = el;
//                       }
//                     }}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
//                   <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
//                     <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
//                       {peer.isHost ? (
//                         <Crown size={10} className="text-amber-400" />
//                       ) : (
//                         !hideProfilePictures && <UserIcon size={10} />
//                       )}
//                       <span>{participantNames[peer.id] || peer.name}</span>
//                     </div>
//                     <div className="flex gap-1">
//                       {peer.isMuted && (
//                         <MicOff size={10} className="text-red-400" />
//                       )}
//                       {peer.isVideoOff && (
//                         <VideoOff size={10} className="text-red-400" />
//                       )}
//                     </div>
//                   </div>
//                   {hoveredParticipant === peer.id && isHost && (
//                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           const newName = prompt(
//                             "Enter new name:",
//                             participantNames[peer.id] || peer.name,
//                           );
//                           if (newName) renameParticipant(peer.id, newName);
//                         }}
//                         className="p-1 bg-white/20 rounded hover:bg-white/30"
//                       >
//                         <Edit size={14} />
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (confirm("Remove this participant?"))
//                             removeParticipant(peer.id);
//                         }}
//                         className="p-1 bg-red-500/50 rounded hover:bg-red-500"
//                       >
//                         <UserMinus size={14} />
//                       </button>
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
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleAudio}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
//                   isMuted
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-white/10 hover:bg-white/20"
//                 }`}
//               >
//                 {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
//               </motion.button>

//               <motion.button
//                 onClick={isRecording ? stopRecording : startRecording}
//                 className={`px-4 py-2 rounded-lg ${
//                   isRecording ? "bg-red-600" : "bg-gray-700"
//                 }`}
//               >
//                 {isRecording ? "Stop Recording" : "Start Recording"}
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleVideo}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
//                   isVideoOff
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-white/10 hover:bg-white/20"
//                 }`}
//               >
//                 {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleScreenShare}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
//                   isScreenSharing
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-white/10 hover:bg-white/20"
//                 }`}
//               >
//                 <ScreenShare size={20} />
//               </motion.button>

//               {/* Reactions Button */}
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setShowReactions(!showReactions)}
//                   className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
//                 >
//                   <Smile size={20} />
//                 </motion.button>
//                 <AnimatePresence>
//                   {showReactions && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl rounded-full p-2 flex gap-2"
//                     >
//                       <button
//                         onClick={() => addReaction("thumbsup")}
//                         className="p-2 hover:bg-white/10 rounded-full transition"
//                       >
//                         <ThumbsUp size={20} />
//                       </button>
//                       <button
//                         onClick={() => addReaction("smile")}
//                         className="p-2 hover:bg-white/10 rounded-full transition"
//                       >
//                         <Smile size={20} />
//                       </button>
//                       <button
//                         onClick={() => addReaction("heart")}
//                         className="p-2 hover:bg-white/10 rounded-full transition"
//                       >
//                         <Heart size={20} />
//                       </button>
//                       <button
//                         onClick={() => addReaction("laugh")}
//                         className="p-2 hover:bg-white/10 rounded-full transition"
//                       >
//                         <Laugh size={20} />
//                       </button>
//                       <button
//                         onClick={() => addReaction("frown")}
//                         className="p-2 hover:bg-white/10 rounded-full transition"
//                       >
//                         <Frown size={20} />
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               {/* Whiteboard Button */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => {
//                   if (permissions.shareWhiteboard || isHost) {
//                     setShowWhiteboard(!showWhiteboard);
//                   } else {
//                     showNotification("Whiteboard is disabled by host", "error");
//                   }
//                 }}
//                 className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
//               >
//                 <Paintbrush size={20} />
//               </motion.button>

//               {/* Settings Button */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setShowSettings(!showSettings)}
//                 className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
//               >
//                 <Settings size={20} />
//               </motion.button>

//               {/* Security Button (Host only) */}
//               {isHost && (
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setShowSecurity(!showSecurity)}
//                   className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
//                 >
//                   <Shield size={20} />
//                 </motion.button>
//               )}

//               {/* Leave/End Meeting Button */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={isHost ? endMeeting : leaveMeeting}
//                 className={`w-14 h-14 rounded-xl flex items-center justify-center transition shadow-lg ${
//                   isHost
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-orange-600 hover:bg-orange-700"
//                 }`}
//               >
//                 <Phone size={24} className="rotate-135" />
//               </motion.button>

//               {/* Participants Toggle */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setShowParticipants(!showParticipants)}
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition relative ${
//                   showParticipants
//                     ? "bg-cyan-600"
//                     : "bg-white/10 hover:bg-white/20"
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
//                   showChat ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"
//                 }`}
//               >
//                 <MessageSquare size={20} />
//                 {messages.length > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center">
//                     {messages.length}
//                   </span>
//                 )}
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Settings Modal */}
//       <AnimatePresence>
//         {showSettings && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center"
//             onClick={() => setShowSettings(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-[#111133] rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold">Settings</h3>
//                 <button
//                   onClick={() => setShowSettings(false)}
//                   className="p-1 hover:bg-white/10 rounded"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="flex items-center justify-between cursor-pointer">
//                     <span>Video Quality</span>
//                     <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
//                       <option>HD (720p)</option>
//                       <option>Full HD (1080p)</option>
//                       <option>Standard (480p)</option>
//                     </select>
//                   </label>
//                 </div>
//                 <div>
//                   <label className="flex items-center justify-between cursor-pointer">
//                     <span>Audio Output</span>
//                     <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
//                       <option>Default</option>
//                       <option>Headphones</option>
//                       <option>Speakers</option>
//                     </select>
//                   </label>
//                 </div>
//                 <div>
//                   <label className="flex items-center justify-between cursor-pointer">
//                     <span>Background Effects</span>
//                     <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
//                       <option>None</option>
//                       <option>Blur</option>
//                       <option>Virtual Background</option>
//                     </select>
//                   </label>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Security Modal (Host only) */}
//       <AnimatePresence>
//         {showSecurity && isHost && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center"
//             onClick={() => setShowSecurity(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-[#111133] rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold flex items-center gap-2">
//                   <ShieldAlert size={20} /> Security Settings
//                 </h3>
//                 <button
//                   onClick={() => setShowSecurity(false)}
//                   className="p-1 hover:bg-white/10 rounded"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <label className="flex items-center justify-between cursor-pointer">
//                   <span className="flex items-center gap-2">
//                     <Lock size={16} /> Lock Meeting
//                   </span>
//                   <button
//                     onClick={toggleMeetingLock}
//                     className={`px-3 py-1 rounded-lg text-sm ${
//                       meetingLocked ? "bg-red-600" : "bg-green-600"
//                     }`}
//                   >
//                     {meetingLocked ? "Locked" : "Unlocked"}
//                   </button>
//                 </label>

//                 <label className="flex items-center justify-between cursor-pointer">
//                   <span className="flex items-center gap-2">
//                     <EyeOff size={16} /> Hide Profile Pictures
//                   </span>
//                   <button
//                     onClick={toggleHideProfilePictures}
//                     className={`px-3 py-1 rounded-lg text-sm ${
//                       hideProfilePictures ? "bg-green-600" : "bg-white/10"
//                     }`}
//                   >
//                     {hideProfilePictures ? "Hidden" : "Visible"}
//                   </button>
//                 </label>

//                 <div className="border-t border-white/10 pt-4">
//                   <h4 className="font-semibold mb-3">
//                     Participant Permissions
//                   </h4>
//                   <div className="space-y-3">
//                     <label className="flex items-center justify-between cursor-pointer">
//                       <span>Allow Chat</span>
//                       <button
//                         onClick={() =>
//                           updatePermissions("chat", !permissions.chat)
//                         }
//                         className={`w-10 h-5 rounded-full transition ${
//                           permissions.chat ? "bg-cyan-600" : "bg-white/20"
//                         } relative`}
//                       >
//                         <div
//                           className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition ${
//                             permissions.chat ? "right-0.5" : "left-0.5"
//                           }`}
//                         />
//                       </button>
//                     </label>

//                     <label className="flex items-center justify-between cursor-pointer">
//                       <span>Allow Screen Sharing</span>
//                       <button
//                         onClick={() =>
//                           updatePermissions(
//                             "shareScreen",
//                             !permissions.shareScreen,
//                           )
//                         }
//                         className={`w-10 h-5 rounded-full transition ${
//                           permissions.shareScreen
//                             ? "bg-cyan-600"
//                             : "bg-white/20"
//                         } relative`}
//                       >
//                         <div
//                           className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition ${
//                             permissions.shareScreen ? "right-0.5" : "left-0.5"
//                           }`}
//                         />
//                       </button>
//                     </label>

//                     <label className="flex items-center justify-between cursor-pointer">
//                       <span>Allow Start Video</span>
//                       <button
//                         onClick={() =>
//                           updatePermissions(
//                             "startVideo",
//                             !permissions.startVideo,
//                           )
//                         }
//                         className={`w-10 h-5 rounded-full transition ${
//                           permissions.startVideo ? "bg-cyan-600" : "bg-white/20"
//                         } relative`}
//                       >
//                         <div
//                           className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition ${
//                             permissions.startVideo ? "right-0.5" : "left-0.5"
//                           }`}
//                         />
//                       </button>
//                     </label>

//                     <label className="flex items-center justify-between cursor-pointer">
//                       <span>Allow Whiteboard</span>
//                       <button
//                         onClick={() =>
//                           updatePermissions(
//                             "shareWhiteboard",
//                             !permissions.shareWhiteboard,
//                           )
//                         }
//                         className={`w-10 h-5 rounded-full transition ${
//                           permissions.shareWhiteboard
//                             ? "bg-cyan-600"
//                             : "bg-white/20"
//                         } relative`}
//                       >
//                         <div
//                           className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition ${
//                             permissions.shareWhiteboard
//                               ? "right-0.5"
//                               : "left-0.5"
//                           }`}
//                         />
//                       </button>
//                     </label>

//                     <label className="flex items-center justify-between cursor-pointer">
//                       <span>Allow Rename Self</span>
//                       <button
//                         onClick={() =>
//                           updatePermissions(
//                             "renameSelf",
//                             !permissions.renameSelf,
//                           )
//                         }
//                         className={`w-10 h-5 rounded-full transition ${
//                           permissions.renameSelf ? "bg-cyan-600" : "bg-white/20"
//                         } relative`}
//                       >
//                         <div
//                           className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition ${
//                             permissions.renameSelf ? "right-0.5" : "left-0.5"
//                           }`}
//                         />
//                       </button>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ================= RIGHT SIDEBAR ================= */}
//       <AnimatePresence>
//         {(showParticipants || showChat) && (
//           <motion.div
//             initial={{ width: 0, opacity: 0 }}
//             animate={{ width: 320, opacity: 1 }}
//             exit={{ width: 0, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col relative"
//           >
//             <div className="p-6 border-b border-white/10">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       setShowParticipants(true);
//                       setShowChat(false);
//                     }}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                       showParticipants
//                         ? "bg-gray-400 text-gray-800"
//                         : "bg-white/5 hover:bg-white/10 cursor-pointer"
//                     }`}
//                   >
//                     Participants
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowChat(true);
//                       setShowParticipants(false);
//                     }}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                       showChat
//                         ? "bg-gray-400 text-gray-800"
//                         : "bg-white/5 hover:bg-white/10 cursor-pointer"
//                     }`}
//                   >
//                     Chat
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowParticipants(false);
//                     setShowChat(false);
//                   }}
//                   className="p-2 cursor-pointer hover:bg-white/10 rounded-lg transition"
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

//             <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20">
//               {showParticipants && (
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#E62064] to-[#E62064]/40 flex items-center justify-center">
//                         <span className="text-xs font-bold">Y</span>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium flex items-center gap-2">
//                           You{" "}
//                           {isHost && (
//                             <Crown size={12} className="text-amber-400" />
//                           )}
//                         </p>
//                         <p className="text-xs text-white/40 flex items-center gap-1">
//                           <span className="w-2 h-2 rounded-full bg-green-400"></span>
//                           Connected
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       {isMuted && <MicOff size={14} className="text-red-400" />}
//                       {isVideoOff && (
//                         <VideoOff size={14} className="text-red-400" />
//                       )}
//                     </div>
//                   </div>

//                   {remotePeers.map((peer) => (
//                     <motion.div
//                       key={peer.id}
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       className="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                             peer.isHost
//                               ? "bg-linear-to-br from-amber-500 to-orange-600"
//                               : "bg-white/10"
//                           }`}
//                         >
//                           {peer.isHost ? (
//                             <Crown size={14} />
//                           ) : (
//                             <UserIcon size={14} />
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium flex items-center gap-2">
//                             {participantNames[peer.id] || peer.name}
//                             {peer.isHost && (
//                               <Crown size={12} className="text-amber-400" />
//                             )}
//                           </p>
//                           <p className="text-xs text-white/40 flex items-center gap-1">
//                             <span className="w-2 h-2 rounded-full bg-green-400"></span>
//                             Connected
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         {peer.isMuted && (
//                           <MicOff size={14} className="text-red-400" />
//                         )}
//                         {peer.isVideoOff && (
//                           <VideoOff size={14} className="text-red-400" />
//                         )}
//                         {isHost && !peer.isHost && (
//                           <button
//                             onClick={() => removeParticipant(peer.id)}
//                             className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition"
//                           >
//                             <UserMinus size={14} className="text-red-400" />
//                           </button>
//                         )}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}

//               {showChat && (
//                 <div className="h-full flex flex-col">
//                   <div ref={chatContainerRef} className="flex-1 space-y-4 mb-4">
//                     {messages.length === 0 ? (
//                       <div className="text-center py-8">
//                         <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
//                         <p className="text-sm text-white/40">No messages yet</p>
//                         <p className="text-xs text-white/20 mt-1">
//                           Start the conversation
//                         </p>
//                       </div>
//                     ) : (
//                       messages.map((msg) => (
//                         <div key={msg.id} className="flex flex-col">
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="text-sm font-medium">
//                               {msg.sender}
//                             </span>
//                             <span className="text-xs text-white/40">
//                               {msg.timestamp.toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               })}
//                             </span>
//                           </div>
//                           <p className="text-sm bg-white/5 p-3 rounded-lg">
//                             {msg.text}
//                           </p>
//                         </div>
//                       ))
//                     )}
//                   </div>

//                   <form onSubmit={sendMessage} className="mt-auto">
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder={
//                           permissions.chat
//                             ? "Type a message..."
//                             : "Chat is disabled by host"
//                         }
//                         disabled={!permissions.chat}
//                         className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
//                       />
//                       <button
//                         type="submit"
//                         disabled={!permissions.chat}
//                         className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition disabled:opacity-50"
//                       >
//                         <MessageSquare size={18} />
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               )}
//             </div>

//             <div className="p-6 border-t border-white/10">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={copyLink}
//                 className="w-full cursor-pointer hover:bg-[#E62064] bg-[#E62064]/90 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
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
//   return (
//     <Suspense
//       fallback={
//         <div className="h-screen w-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-lg font-semibold text-white/70">
//               Loading meeting...
//             </p>
//           </div>
//         </div>
//       }
//     >
//       <MeetingContent />
//     </Suspense>
//   );
// }

"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
  Maximize2,
  Minimize2,
  ScreenShare,
  Crown,
  User as UserIcon,
  X,
  Check,
  AlertCircle,
  WifiOff,
  ThumbsUp,
  Smile,
  Heart,
  Laugh,
  Frown,
  Settings,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Edit,
  LogOut,
  Flag,
  Trash2,
  Paintbrush,
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
  Undo,
  Redo,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  UserMinus,
} from "lucide-react";
import {
  LiveKitRoom,
  useRoomContext,
  useLocalParticipant,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import { Track, RoomEvent } from "livekit-client";
import "@livekit/components-styles/index.css";

// Three.js 360° component
const ThreeSixtyView = dynamic(() => import("@/components/ThreeSixtyView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading 360° view...</p>
      </div>
    </div>
  ),
});

export default function MeetingPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isHost = searchParams.get("role") === "host";
  const [token, setToken] = useState(null);

  useEffect(() => {
    const userId =
      localStorage.getItem("meeting_user_id") || crypto.randomUUID();
    localStorage.setItem("meeting_user_id", userId);
    const tokenUrl =
      process.env.NEXT_PUBLIC_TOKEN_URL || "http://localhost:7860/token";
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
        // Force a specific region to reduce latency (choose the closest region to your users)
        // region: 'us', // uncomment and set to 'us', 'eu', 'ap', etc.
        publishDefaults: {
          videoEncoding: {
            maxBitrate: 1_000_000, // 1 Mbps – reduces bandwidth
            maxFramerate: 24,
          },
        },
      }}
    >
      <MeetingUI isHost={isHost} roomId={roomId} router={router} />
    </LiveKitRoom>
  );
}

function MeetingUI({ isHost, roomId, router }) {
  const room = useRoomContext();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();
  const tracks = useTracks();

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingStreamRef = useRef(null);

  // UI states
  const [viewMode, setViewMode] = useState("360");
  const [activeStreamId, setActiveStreamId] = useState("local");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("good");
  const [showControls, setShowControls] = useState(true);
  const [notification, setNotification] = useState(null);
  const [hoveredParticipant, setHoveredParticipant] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [whiteboardMode, setWhiteboardMode] = useState("draw");
  const [whiteboardColor, setWhiteboardColor] = useState("#E62064");
  const [whiteboardData, setWhiteboardData] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [meetingLocked, setMeetingLocked] = useState(false);
  const [hideProfilePictures, setHideProfilePictures] = useState(false);
  const [permissions, setPermissions] = useState({
    chat: true,
    shareScreen: true,
    startVideo: true,
    shareWhiteboard: true,
    renameSelf: true,
  });
  const [participantNames, setParticipantNames] = useState({});

  // Refs
  const controlsTimeoutRef = useRef(null);
  const videoRefs = useRef({});
  const chatContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const localVideoRef = useRef(null);
  const mainVideoRef = useRef(null);

  // ----- Chat using LiveKit DataChannel -----
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload, participant) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: message.text,
            sender: participant.identity,
            timestamp: new Date(),
          },
        ]);
      } catch (e) {
        console.error("Failed to parse chat message", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && permissions.chat) {
      const messageData = { text: newMessage };
      const encoder = new TextEncoder();
      const payload = encoder.encode(JSON.stringify(messageData));
      await room.localParticipant.publishData(payload);
      // Also add locally for immediate display
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: newMessage,
          sender: "You",
          timestamp: new Date(),
        },
      ]);
      setNewMessage("");
      showNotification("Message sent", "success");
    } else if (!permissions.chat) {
      showNotification("Chat is disabled by host", "error");
    }
  };
  // ------------------------------------

  // Derive streams from LiveKit tracks
  const localVideoTrack = tracks.find(
    (t) =>
      t.participant.identity === localParticipant.localParticipant?.identity &&
      t.source === Track.Source.Camera,
  );
  const localStream = useMemo(() => {
    if (!localVideoTrack?.publication?.track?.mediaStream) return null;
    return new MediaStream([
      localVideoTrack.publication.track.mediaStreamTrack,
    ]);
  }, [localVideoTrack]);

  // Include both Camera and ScreenShare for remote tracks
  const remoteTracks = tracks.filter(
    (t) =>
      t.participant.identity !== localParticipant.localParticipant?.identity &&
      (t.source === Track.Source.Camera ||
        t.source === Track.Source.ScreenShare),
  );
  const remoteStreams = useMemo(() => {
    const map = new Map();
    remoteTracks.forEach((track) => {
      const stream = new MediaStream([
        track.publication.track.mediaStreamTrack,
      ]);
      map.set(track.participant.identity, stream);
    });
    return map;
  }, [remoteTracks]);

  const activeStream = useMemo(() => {
    return activeStreamId === "local"
      ? localStream
      : remoteStreams.get(activeStreamId);
  }, [activeStreamId, localStream, remoteStreams]);

  // Build remotePeers array for UI (including screen share, but we treat as same participant)
  const remotePeers = participants
    .filter((p) => p.identity !== localParticipant.localParticipant?.identity)
    .map((p) => ({
      id: p.identity,
      stream: remoteStreams.get(p.identity), // this will be the last stream (camera or screen)
      isHost: p.metadata ? JSON.parse(p.metadata)?.isHost : false,
      isMuted: false, // you can track mute state if needed
      isVideoOff: false,
      name: participantNames[p.identity] || `Guest ${p.identity.slice(0, 6)}`,
    }));

  const participantCount = participants.length + 1;

  // Helper functions
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/meeting/${roomId}?role=guest`,
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

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(
        () => setShowControls(false),
        3000,
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Recording functions (unchanged)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      recordingStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `holovox-meeting-${Date.now()}.webm`;
      a.click();
      recordedChunksRef.current = [];
      if (recordingStreamRef.current) {
        recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    setIsRecording(false);
  };

  // Reactions (unchanged)
  const addReaction = (reactionType) => {
    const reaction = {
      id: Date.now(),
      type: reactionType,
      sender: "You",
      timestamp: new Date(),
    };
    setReactions([...reactions, reaction]);
    showNotification(`You sent a ${reactionType} reaction`);
    setShowReactions(false);
    setTimeout(
      () => setReactions((prev) => prev.filter((r) => r.id !== reaction.id)),
      3000,
    );
  };

  const getReactionIcon = (type) => {
    switch (type) {
      case "thumbsup":
        return <ThumbsUp size={24} className="text-yellow-400" />;
      case "smile":
        return <Smile size={24} className="text-yellow-400" />;
      case "heart":
        return <Heart size={24} className="text-red-400" />;
      case "laugh":
        return <Laugh size={24} className="text-yellow-400" />;
      case "frown":
        return <Frown size={24} className="text-yellow-400" />;
      default:
        return <Smile size={24} className="text-yellow-400" />;
    }
  };

  // Whiteboard functions (unchanged)
  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    if (whiteboardMode === "erase") {
      ctxRef.current.globalCompositeOperation = "destination-out";
      ctxRef.current.lineWidth = 20;
    } else {
      ctxRef.current.globalCompositeOperation = "source-over";
      ctxRef.current.strokeStyle = whiteboardColor;
      ctxRef.current.lineWidth = 2;
    }
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    const imageData = canvasRef.current.toDataURL();
    setWhiteboardData([...whiteboardData, imageData]);
  };

  const clearWhiteboard = () => {
    if (ctxRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      setWhiteboardData([]);
      showNotification("Whiteboard cleared", "success");
    }
  };

  const downloadWhiteboard = () => {
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
    showNotification("Whiteboard downloaded", "success");
  };

  // Security functions
  const toggleMeetingLock = () => {
    setMeetingLocked(!meetingLocked);
    showNotification(
      meetingLocked
        ? "Meeting unlocked"
        : "Meeting locked - No new participants can join",
    );
  };

  const toggleHideProfilePictures = () => {
    setHideProfilePictures(!hideProfilePictures);
    showNotification(
      hideProfilePictures
        ? "Profile pictures visible"
        : "Profile pictures hidden",
    );
  };

  const updatePermissions = (permission, value) => {
    if (isHost) {
      setPermissions({ ...permissions, [permission]: value });
      showNotification(
        `${permission} ${value ? "enabled" : "disabled"}`,
        "success",
      );
    }
  };

  const removeParticipant = (peerId) => {
    if (isHost) showNotification("Participant removed", "success");
  };

  const renameParticipant = (peerId, newName) => {
    if (permissions.renameSelf || isHost) {
      setParticipantNames({ ...participantNames, [peerId]: newName });
      showNotification("Name updated", "success");
    } else {
      showNotification("Renaming is disabled by host", "error");
    }
  };

  const endMeeting = () => {
    if (isHost) {
      showNotification("Ending meeting for everyone...", "info");
      setTimeout(async () => {
        await room.disconnect();
        router.push("/home");
      }, 1000);
    }
  };

  const leaveMeeting = async () => {
    await room.disconnect();
    router.push("/home");
  };

  // Media controls using LiveKit API
  const toggleAudio = async () => {
    if (localParticipant.isMicrophoneEnabled) {
      await localParticipant.localParticipant.setMicrophoneEnabled(false);
      setIsMuted(true);
    } else {
      await localParticipant.localParticipant.setMicrophoneEnabled(true);
      setIsMuted(false);
    }
    showNotification(isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleVideo = async () => {
    if (permissions.startVideo || isHost) {
      if (localParticipant.isCameraEnabled) {
        await localParticipant.localParticipant.setCameraEnabled(false);
        setIsVideoOff(true);
      } else {
        await localParticipant.localParticipant.setCameraEnabled(true);
        setIsVideoOff(false);
      }
      showNotification(isVideoOff ? "Camera turned on" : "Camera turned off");
    } else {
      showNotification("Video is disabled by host", "error");
    }
  };

  const toggleScreenShare = async () => {
    if (permissions.shareScreen || isHost) {
      if (isScreenSharing) {
        const screenPub = localParticipant.localParticipant.getTrackPublication(
          Track.Source.ScreenShare,
        );
        if (screenPub) await screenPub.unpublish();
        setIsScreenSharing(false);
        showNotification("Stopped screen sharing");
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        const track = stream.getVideoTracks()[0];
        await localParticipant.localParticipant.publishTrack(track, {
          source: Track.Source.ScreenShare,
        });
        setIsScreenSharing(true);
        showNotification("Started screen sharing");
        track.onended = () => setIsScreenSharing(false);
      }
    } else {
      showNotification("Screen sharing is disabled by host", "error");
    }
  };

  // Simulate connection quality (remove in production)
  useEffect(() => {
    const interval = setInterval(() => {
      const qualities = ["good", "average", "poor"];
      setConnectionQuality(
        qualities[Math.floor(Math.random() * qualities.length)],
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Initialize whiteboard canvas
  useEffect(() => {
    if (showWhiteboard && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = whiteboardColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctxRef.current = ctx;
    }
  }, [showWhiteboard, whiteboardColor]);

  // Debug: log audio track state
  useEffect(() => {
    const checkAudio = setInterval(() => {
      const mic = localParticipant.localParticipant?.getTrack(
        Track.Source.Microphone,
      );
      console.log(
        "Mic track:",
        mic
          ? `enabled=${mic.isEnabled}, muted=${mic.isMuted}`
          : "not published",
      );
    }, 5000);
    return () => clearInterval(checkAudio);
  }, [localParticipant]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-700 text-white">
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

      {/* Floating Reactions */}
      <div className="fixed top-20 right-20 z-50 space-y-2">
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/60 backdrop-blur-lg rounded-full p-3"
          >
            {getReactionIcon(reaction.type)}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top navbar (unchanged) */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: showControls ? 0 : -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#E62064] to-[#E62064]/40 flex items-center justify-center">
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
                {meetingLocked && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </h1>
              <p className="text-xs text-white/80">Room: {roomId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-white/5 rounded-lg">
              <span className="text-xs font-mono">00:15:23</span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </motion.div>

        {/* Video area (unchanged but using updated remote tracks) */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {/* View mode toggle */}
          <div className="absolute top-24 right-6 z-30">
            <button
              onClick={() => setViewMode(viewMode === "360" ? "normal" : "360")}
              className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition shadow-2xl"
            >
              {viewMode === "360" ? (
                <>
                  <Video size={18} className="text-cyan-400" />
                  <span className="text-xs font-medium">Switch to Normal</span>
                </>
              ) : (
                <>
                  <Maximize2 size={18} className="text-purple-400" />
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
                <ThreeSixtyView
                  stream={activeStream}
                  isVisible={viewMode === "360"}
                />
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
                    if (el && activeStream) el.srcObject = activeStream;
                    mainVideoRef.current = el;
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

          {/* Whiteboard overlay */}
          <AnimatePresence>
            {showWhiteboard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-40 bg-black/90 backdrop-blur-lg flex flex-col"
              >
                <div className="bg-black/60 backdrop-blur-xl p-4 flex items-center gap-3 border-b border-white/10">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWhiteboardMode("draw")}
                      className={`p-2 rounded-lg transition ${whiteboardMode === "draw" ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"}`}
                    >
                      <PenTool size={18} />
                    </button>
                    <button
                      onClick={() => setWhiteboardMode("erase")}
                      className={`p-2 rounded-lg transition ${whiteboardMode === "erase" ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"}`}
                    >
                      <Eraser size={18} />
                    </button>
                    <input
                      type="color"
                      value={whiteboardColor}
                      onChange={(e) => setWhiteboardColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <button
                      onClick={clearWhiteboard}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={downloadWhiteboard}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowWhiteboard(false)}
                    className="ml-auto p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    <X size={18} />
                  </button>
                </div>
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="flex-1 cursor-crosshair"
                  style={{ touchAction: "none" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating thumbnails */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: showControls ? 0 : 100 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-24 left-0 right-0 px-6 z-40"
          >
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {/* Local thumbnail */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStreamId("local")}
                className={`relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                  activeStreamId === "local"
                    ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <video
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  ref={(el) => {
                    if (el && localStream) el.srcObject = localStream;
                    localVideoRef.current = el;
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
                    {!hideProfilePictures && <UserIcon size={10} />}
                    <span>{participantNames["local"] || "You"}</span>
                  </div>
                  <div className="flex gap-1">
                    {isMuted && <MicOff size={10} className="text-red-400" />}
                    {isVideoOff && (
                      <VideoOff size={10} className="text-red-400" />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Remote thumbnails */}
              {remotePeers.map((peer) => (
                <motion.div
                  key={peer.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredParticipant(peer.id)}
                  onHoverEnd={() => setHoveredParticipant(null)}
                  onClick={() => setActiveStreamId(peer.id)}
                  className={`relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                    activeStreamId === peer.id
                      ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <video
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    ref={(el) => {
                      if (el && peer.stream) el.srcObject = peer.stream;
                      videoRefs.current[peer.id] = el;
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
                      {peer.isHost ? (
                        <Crown size={10} className="text-amber-400" />
                      ) : (
                        !hideProfilePictures && <UserIcon size={10} />
                      )}
                      <span>{participantNames[peer.id] || peer.name}</span>
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
                  {hoveredParticipant === peer.id && isHost && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt(
                            "Enter new name:",
                            participantNames[peer.id] || peer.name,
                          );
                          if (newName) renameParticipant(peer.id, newName);
                        }}
                        className="p-1 bg-white/20 rounded hover:bg-white/30"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Remove this participant?"))
                            removeParticipant(peer.id);
                        }}
                        className="p-1 bg-red-500/50 rounded hover:bg-red-500"
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Control bar */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: showControls ? 0 : 100 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
              <button
                onClick={toggleAudio}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                  isMuted
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-lg ${isRecording ? "bg-red-600" : "bg-gray-700"}`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>

              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                  isVideoOff
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                  isScreenSharing
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <ScreenShare size={20} />
              </button>

              {/* Reactions button */}
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <Smile size={20} />
                </button>
                <AnimatePresence>
                  {showReactions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl rounded-full p-2 flex gap-2"
                    >
                      <button onClick={() => addReaction("thumbsup")}>
                        <ThumbsUp size={20} />
                      </button>
                      <button onClick={() => addReaction("smile")}>
                        <Smile size={20} />
                      </button>
                      <button onClick={() => addReaction("heart")}>
                        <Heart size={20} />
                      </button>
                      <button onClick={() => addReaction("laugh")}>
                        <Laugh size={20} />
                      </button>
                      <button onClick={() => addReaction("frown")}>
                        <Frown size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Whiteboard button */}
              <button
                onClick={() => {
                  if (permissions.shareWhiteboard || isHost) {
                    setShowWhiteboard(!showWhiteboard);
                  } else {
                    showNotification("Whiteboard is disabled by host", "error");
                  }
                }}
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Paintbrush size={20} />
              </button>

              {/* Settings button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Settings size={20} />
              </button>

              {/* Security button (host only) */}
              {isHost && (
                <button
                  onClick={() => setShowSecurity(!showSecurity)}
                  className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <Shield size={20} />
                </button>
              )}

              {/* Leave / End meeting */}
              <button
                onClick={isHost ? endMeeting : leaveMeeting}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition shadow-lg ${
                  isHost
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                <Phone size={24} className="rotate-135" />
              </button>

              {/* Participants toggle */}
              <button
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
              </button>

              {/* Chat toggle */}
              <button
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
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right sidebar (participants / chat) - uses the new sendMessage function */}
      <AnimatePresence>
        {(showParticipants || showChat) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col relative"
          >
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
                        ? "bg-gray-400 text-gray-800"
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
                      showChat
                        ? "bg-gray-400 text-gray-800"
                        : "bg-white/5 hover:bg-white/10"
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
                  className="p-2 cursor-pointer hover:bg-white/10 rounded-lg"
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

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20">
              {showParticipants && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#E62064] to-[#E62064]/40 flex items-center justify-center">
                        <span className="text-xs font-bold">Y</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2">
                          You{" "}
                          {isHost && (
                            <Crown size={12} className="text-amber-400" />
                          )}
                        </p>
                        <p className="text-xs text-white/40 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
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

                  {remotePeers.map((peer) => (
                    <div
                      key={peer.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
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
                          <p className="text-sm font-medium flex items-center gap-2">
                            {participantNames[peer.id] || peer.name}
                            {peer.isHost && (
                              <Crown size={12} className="text-amber-400" />
                            )}
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
                        {isHost && !peer.isHost && (
                          <button
                            onClick={() => removeParticipant(peer.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition"
                          >
                            <UserMinus size={14} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showChat && (
                <div className="h-full flex flex-col">
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

                  <form onSubmit={sendMessage} className="mt-auto">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                          permissions.chat
                            ? "Type a message..."
                            : "Chat is disabled by host"
                        }
                        disabled={!permissions.chat}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!permissions.chat}
                        className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition disabled:opacity-50"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10">
              <button
                onClick={copyLink}
                className="w-full cursor-pointer hover:bg-[#E62064] bg-[#E62064]/90 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <Copy size={16} /> Copy Invite Link
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal (unchanged) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111133] rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Video Quality</span>
                    <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
                      <option>HD (720p)</option>
                      <option>Full HD (1080p)</option>
                      <option>Standard (480p)</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Audio Output</span>
                    <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
                      <option>Default</option>
                      <option>Headphones</option>
                      <option>Speakers</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Background Effects</span>
                    <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
                      <option>None</option>
                      <option>Blur</option>
                      <option>Virtual Background</option>
                    </select>
                  </label>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Modal (unchanged) */}
      <AnimatePresence>
        {showSecurity && isHost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center"
            onClick={() => setShowSecurity(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111133] rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShieldAlert size={20} /> Security Settings
                </h3>
                <button
                  onClick={() => setShowSecurity(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Lock size={16} /> Lock Meeting
                  </span>
                  <button
                    onClick={toggleMeetingLock}
                    className={`px-3 py-1 rounded-lg text-sm ${meetingLocked ? "bg-red-600" : "bg-green-600"}`}
                  >
                    {meetingLocked ? "Locked" : "Unlocked"}
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <EyeOff size={16} /> Hide Profile Pictures
                  </span>
                  <button
                    onClick={toggleHideProfilePictures}
                    className={`px-3 py-1 rounded-lg text-sm ${hideProfilePictures ? "bg-green-600" : "bg-white/10"}`}
                  >
                    {hideProfilePictures ? "Hidden" : "Visible"}
                  </button>
                </label>
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-semibold mb-3">
                    Participant Permissions
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(permissions).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>
                          Allow{" "}
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                        <button
                          onClick={() => updatePermissions(key, !value)}
                          className={`w-10 h-5 rounded-full transition ${value ? "bg-cyan-600" : "bg-white/20"} relative`}
                        >
                          <div
                            className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition ${value ? "right-0.5" : "left-0.5"}`}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
