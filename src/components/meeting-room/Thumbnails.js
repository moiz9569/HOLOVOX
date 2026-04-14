import { motion } from "framer-motion";
import {
  Crown,
  UserIcon,
  MicOff,
  VideoOff,
  Edit,
  UserMinus,
} from "lucide-react";

export default function Thumbnails({
  showControls,
  activeStreamId,
  setActiveStreamId,
  localStream,
  localVideoRef,
  isMuted,
  isVideoOff,
  remotePeers,
  hoveredParticipant,
  setHoveredParticipant,
  hideProfilePictures,
  participantNames,
  isHost,
  renameParticipant,
  removeParticipant,
}) {
  return (
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
            style={{ transform: "scaleX(-1)" }}
            ref={(el) => {
              if (el && localStream && el.srcObject !== localStream) {
  el.srcObject = localStream;
}
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
              {isVideoOff && <VideoOff size={10} className="text-red-400" />}
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
//               ref={(el) => {
//                 // if (el && peer.stream) el.srcObject = peer.stream;
//                if (el) {
//  if (el && peer.stream) {
//   el.srcObject = peer.stream;
// }
// }
//               }}
ref={(el) => {
  if (el && peer.stream && el.srcObject !== peer.stream) {
    el.srcObject = peer.stream;
  }
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
                {peer.isMuted && <MicOff size={10} className="text-red-400" />}
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
  );
}
