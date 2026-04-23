import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  ScreenShare,
  Smile,
  Paintbrush,
  Settings,
  Shield,
  Users,
  MessageSquare,
  ThumbsUp,
  Heart,
  Laugh,
  Frown,
} from "lucide-react";

export default function ControlBar({
  showControls,
  isMuted,
  toggleAudio,
  isRecording,
  startRecording,
  stopRecording,
  isVideoOff,
  toggleVideo,
  isScreenSharing,
  toggleScreenShare,
  showReactions,
  setShowReactions,
  addReaction,
  showWhiteboard,
  setShowWhiteboard,
  permissions,
  isHost,
  showNotification,
  setShowSettings,
  setShowSecurity,
  isHostAction,
  endMeeting,
  leaveMeeting,
  showParticipants,
  setShowParticipants,
  remotePeers,
  showChat,
  setShowChat,
  messages,
}) {
  const iconButtonBase =
    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition shrink-0";

 const handleMeetingAction = () => {
  if (isHost) {
    endMeeting();
  } else {
    leaveMeeting();
    localStorage.removeItem("meeting_data");
  }
};
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: showControls ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-auto"
    >
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 max-w-full bg-black/60 backdrop-blur-xl px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-white/10 shadow-2xl">
        <button
          onClick={toggleAudio}
          className={`${iconButtonBase} ${
            isMuted
              ? "bg-red-600 hover:bg-red-700"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`h-10 px-3 sm:px-4 rounded-lg text-xs sm:text-sm shrink-0 ${isRecording ? "bg-red-600" : "bg-gray-700"}`}
        >
          {isRecording ? (
            <>
              <span className="sm:hidden">Stop</span>
              <span className="hidden sm:inline">Stop Recording</span>
            </>
          ) : (
            <>
              <span className="sm:hidden">Record</span>
              <span className="hidden sm:inline">Start Recording</span>
            </>
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`${iconButtonBase} ${
            isVideoOff
              ? "bg-red-600 hover:bg-red-700"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`${iconButtonBase} ${
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
            className={`${iconButtonBase} bg-white/10 hover:bg-white/20`}
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
          className={`${iconButtonBase} bg-white/10 hover:bg-white/20`}
        >
          <Paintbrush size={20} />
        </button>

        {/* Settings button */}
        <button
          onClick={() => setShowSettings(true)}
          className={`${iconButtonBase} bg-white/10 hover:bg-white/20`}
        >
          <Settings size={20} />
        </button>

        {/* Security button (host only) */}
        {isHost && (
          <button
            onClick={() => setShowSecurity(true)}
            className={`${iconButtonBase} bg-white/10 hover:bg-white/20`}
          >
            <Shield size={20} />
          </button>
        )}

        {/* Leave / End meeting */}
        <button
          onClick={() => {
  if (isHost) {
    endMeeting();
    localStorage.removeItem("meeting_data");
    console.log("Meeting ended and meeting data cleared from localStorage for host");
  } else {
    leaveMeeting();
    localStorage.removeItem("meeting_data");
    console.log("Meeting data cleared from localStorage for guest");
  }
}}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition shadow-lg shrink-0 ${
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
          className={`${iconButtonBase} relative ${
            showParticipants ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"
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
          className={`${iconButtonBase} relative ${
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
  );
}
