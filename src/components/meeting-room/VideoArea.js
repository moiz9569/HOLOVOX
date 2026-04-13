import { motion, AnimatePresence } from "framer-motion";
import { Video, Maximize2, Podcast } from "lucide-react";
import ThreeSixtyView from "@/components/Threesixty";
import HostPodcast from "@/components/HostPodcast";

export default function VideoArea({
  viewMode,
  setViewMode,
  activeStream,
  activeStreamId,
  mainVideoRef,
  showWhiteboard,
  WhiteboardComponent,
  remoteParticipants = [],
  room,
}) {
  const cycleViewMode = () => {
    if (viewMode === "normal") {
      setViewMode("360");
    } else if (viewMode === "360") {
      setViewMode("podcast");
    } else {
      setViewMode("normal");
    }
  };

  const getButtonLabel = () => {
    if (viewMode === "normal") return "Switch to 360°";
    if (viewMode === "360") return "Switch to Podcast";
    return "Switch to Normal";
  };

  const getButtonIcon = () => {
    if (viewMode === "normal") return <Maximize2 size={18} className="text-purple-400" />;
    if (viewMode === "360") return <Podcast size={18} className="text-green-400" />;
    return <Video size={18} className="text-cyan-400" />;
  };

  return (
    <div className="flex-1 relative bg-black overflow-hidden">
      {/* View mode toggle */}
      <div className="absolute top-24 right-6 z-30">
        <button
          onClick={cycleViewMode}
          className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition shadow-2xl"
        >
          {getButtonIcon()}
          <span className="text-xs font-medium">{getButtonLabel()}</span>
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
        ) : viewMode === "podcast" ? (
          <motion.div
            key="podcastView"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            {/* <HostPodcast participants={remoteParticipants} /> */}
            <HostPodcast participants={remoteParticipants} room={room} />
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
              key={activeStreamId}
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

      {showWhiteboard && WhiteboardComponent}
    </div>
  );
}















// import { motion, AnimatePresence } from "framer-motion";
// import { Video, Maximize2 } from "lucide-react";
// import ThreeSixtyView from "../Threesixty";

// export default function VideoArea({
//   viewMode,
//   setViewMode,
//   activeStream,
//   activeStreamId,
//   mainVideoRef,
//   showWhiteboard,
//   WhiteboardComponent,
// }) {
//   return (
//     <div className="flex-1 relative bg-black overflow-hidden">
//       {/* View mode toggle */}
//       <div className="absolute top-24 right-6 z-30">
//         <button
//           onClick={() => setViewMode(viewMode === "360" ? "normal" : "360")}
//           className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition shadow-2xl"
//         >
//           {viewMode === "360" ? (
//             <>
//               <Video size={18} className="text-cyan-400" />
//               <span className="text-xs font-medium">Switch to Normal</span>
//             </>
//           ) : (
//             <>
//               <Maximize2 size={18} className="text-purple-400" />
//               <span className="text-xs font-medium">Switch to 360°</span>
//             </>
//           )}
//         </button>
//       </div>

//       <AnimatePresence mode="wait">
//         {viewMode === "360" ? (
//           <motion.div
//             key="360view"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="h-full w-full"
//           >
//             <ThreeSixtyView
//               stream={activeStream}
//               isVisible={viewMode === "360"}
//             />
//           </motion.div>
//         ) : (
//           <motion.div
//             key="normalView"
//             initial={{ opacity: 0, scale: 1.05 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0 }}
//             className="h-full w-full flex items-center justify-center bg-slate-950"
//           >
//             <video
//               key={activeStreamId}
//               autoPlay
//               playsInline
//               className="w-full h-full object-cover"
//               ref={(el) => {
//                 if (el && activeStream) el.srcObject = activeStream;
//                 mainVideoRef.current = el;
//               }}
//             />
//             <div className="absolute bottom-10 left-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 z-20">
//               <p className="text-sm font-medium flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//                 Standard View:{" "}
//                 {activeStreamId === "local"
//                   ? "You (Local Preview)"
//                   : "Participant"}
//               </p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {showWhiteboard && WhiteboardComponent}
//     </div>
//   );
// }
