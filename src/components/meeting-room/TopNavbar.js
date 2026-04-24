import { motion } from "framer-motion";
import { Crown, Lock, Maximize2, Minimize2, PanelRight } from "lucide-react";

export default function TopNavbar({
  showControls,
  isHost,
  meetingLocked,
  roomId,
  isFullscreen,
  toggleFullscreen,
  isSidebarOpen = false,
  onToggleSidebar,
  meetingDuration,
}) {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: showControls ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="absolute top-0 left-0 right-0 z-20 px-3 py-3 sm:px-6 sm:py-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      <div className="min-w-0 flex items-center gap-2 sm:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#E62064] to-[#E62064]/40 flex items-center justify-center shrink-0">
          <span className="text-sm sm:text-lg text-white font-bold">H</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm text-white font-semibold flex items-center gap-2 min-w-0">
            <span className="truncate">Business Weekly Meeting</span>
            {isHost && (
              <span className="hidden sm:flex px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs items-center gap-1 shrink-0">
                <Crown size={12} /> Host
              </span>
            )}
            {meetingLocked && (
              <span className="hidden sm:flex px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs items-center gap-1 shrink-0">
                <Lock size={10} /> Locked
              </span>
            )}
          </h1>
          <p className="text-[11px] sm:text-xs text-white/80 truncate">Room: {roomId}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          className={`h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg border transition flex items-center gap-2 text-xs sm:text-sm ${
            isSidebarOpen
              ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-100"
              : "bg-white/5 border-white/10 text-white hover:bg-white/10"
          }`}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <PanelRight size={16} />
          <span className="hidden md:inline">Panel</span>
        </button>

        <div className="hidden sm:block px-3 py-1.5 bg-white/5 rounded-lg">
          <span className="text-xs text-white font-mono">{meetingDuration}</span>
        </div>
        <button
          onClick={toggleFullscreen}
          className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center hover:bg-white/10 text-white rounded-lg transition"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </motion.div>
  );
}
