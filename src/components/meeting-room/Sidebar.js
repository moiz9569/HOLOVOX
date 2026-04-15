import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  UserIcon,
  MicOff,
  VideoOff,
  UserMinus,
  MessageSquare,
  Copy,
  Plus,
  Trash2,
} from "lucide-react";

export default function Sidebar({
  showNotes,
  setShowNotes,
  notes,
  addNote,
  updateNote,
  deleteNote,
  showParticipants,
  showChat,
  setShowParticipants,
  setShowChat,
  remotePeers,
  isHost,
  participantNames,
  isMuted,
  isVideoOff,
  removeParticipant,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  chatContainerRef,
  permissions,
  copyLink,
}) {
  return (
    <AnimatePresence>
      {(showParticipants || showChat || showNotes) && (
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
                    setShowNotes(false);
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
                    setShowNotes(false);
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

                <button
                  onClick={() => {
                    setShowNotes(true);
                    setShowParticipants(false);
                    setShowChat(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    showNotes
                      ? "bg-gray-400 text-gray-800"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  Notes
                </button>
              </div>
              
              <button
                onClick={() => {
                  setShowParticipants(false);
                  setShowChat(false);
                  setShowNotes(false);   // add this line
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

            {showNotes && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40">Your private notes</p>
                  <button
                    onClick={addNote}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {notes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-white/40">No notes yet</p>
                    <button
                      onClick={addNote}
                      className="mt-2 text-xs text-cyan-400 hover:underline"
                    >
                      Create your first note
                    </button>
                  </div>
                )}

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white/5 rounded-lg p-3 group relative"
                    >
                      <textarea
                        value={note.text}
                        onChange={(e) => updateNote(note.id, e.target.value)}
                        placeholder="Write your note here..."
                        rows={3}
                        className="w-full bg-transparent text-sm text-white placeholder-white/30 resize-y focus:outline-none"
                      />
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-white/20 text-center">
                  Notes are saved only in this browser session
                </p>
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
  );
}
