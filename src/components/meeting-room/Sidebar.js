// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   Crown,
//   UserIcon,
//   MicOff,
//   VideoOff,
//   UserMinus,
//   MessageSquare,
//   Copy,
//   Plus,
//   Trash2,
// } from "lucide-react";
// import { useState } from "react";

// export default function Sidebar({
//   roomId,
//   userId,
//   showNotes,
//   setShowNotes,
//   notes,
//   addNote,
//   updateNote,
//   deleteNote,
//   showParticipants,
//   showChat,
//   setShowParticipants,
//   setShowChat,
//   remotePeers,
//   isHost,
//   participantNames,
//   isMuted,
//   isVideoOff,
//   removeParticipant,
//   messages,
//   newMessage,
//   setNewMessage,
//   sendMessage,
//   chatContainerRef,
//   permissions,
//   copyLink,
// }) {
//   // console.log("Sidebar Props - userId:", userId);
//   // console.log("Sidebar Props - roomId:", roomId);
//   const [savedNotes, setSavedNotes] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);

//   const saveNotes = async (e) => {
//   e.preventDefault();

//  const validNotes = notes.filter(
//   (note) => note.text.trim() !== "" && !note.saved
// );

//   if (validNotes.length === 0) return;

//   const noteTexts = validNotes.map((note) => note.text);
//   notes.forEach((note) => {
//   updateNote(note.id, "");
//   note.saved = true;
// });

//   setIsSaving(true);

//   try {
//     const res = await fetch("/api/user/notes", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         meetingId: roomId,
//         userId: userId,
//         note: noteTexts, // API requirement
//       }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       console.log("Notes saved successfully:", data.data);

//       // ✅ Move to saved cards
//       setSavedNotes((prev) => [
//         ...validNotes.map((note) => ({
//           ...note,
//           isEditing: false,
//         })),
//         ...prev,
//       ]);

//       // ✅ Clear input notes
//       notes.forEach((note) => updateNote(note.id, ""));
//     } else {
//       console.error("Failed to save notes:", data.message);
//     }
//   } catch (error) {
//     console.error("Error saving notes:", error);
//   }

//   setIsSaving(false);
// };

//   const editSavedNote = (id, newText) => {
//     setSavedNotes((prev) =>
//       prev.map((note) => (note.id === id ? { ...note, text: newText } : note)),
//     );
//   };

//   const toggleEdit = (id) => {
//     setSavedNotes((prev) =>
//       prev.map((note) =>
//         note.id === id ? { ...note, isEditing: !note.isEditing } : note,
//       ),
//     );
//   };

//   const deleteSavedNote = (id) => {
//     setSavedNotes((prev) => prev.filter((note) => note.id !== id));
//   };

//   return (
//     <AnimatePresence>
//       {(showParticipants || showChat || showNotes) && (
//         <motion.div
//           initial={{ width: 0, opacity: 0 }}
//           animate={{ width: 320, opacity: 1 }}
//           exit={{ width: 0, opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col relative"
//         >
//           <div className="p-6 border-b border-white/10">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setShowParticipants(true);
//                     setShowChat(false);
//                     setShowNotes(false);
//                   }}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                     showParticipants
//                       ? "bg-gray-400 text-gray-800"
//                       : "bg-white/5 hover:bg-white/10"
//                   }`}
//                 >
//                   Participants
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowChat(true);
//                     setShowNotes(false);
//                     setShowParticipants(false);
//                   }}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                     showChat
//                       ? "bg-gray-400 text-gray-800"
//                       : "bg-white/5 hover:bg-white/10"
//                   }`}
//                 >
//                   Chat
//                 </button>

//                 <button
//                   onClick={() => {
//                     setShowNotes(true);
//                     setShowParticipants(false);
//                     setShowChat(false);
//                   }}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                     showNotes
//                       ? "bg-gray-400 text-gray-800"
//                       : "bg-white/5 hover:bg-white/10"
//                   }`}
//                 >
//                   Notes
//                 </button>
//               </div>

//               <button
//                 onClick={() => {
//                   setShowParticipants(false);
//                   setShowChat(false);
//                   setShowNotes(false); // add this line
//                 }}
//                 className="p-2 cursor-pointer hover:bg-white/10 rounded-lg"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             {showParticipants && (
//               <p className="text-xs text-white/40">
//                 {remotePeers.length + 1} participants
//               </p>
//             )}
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20">
//             {showParticipants && (
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#E62064] to-[#E62064]/40 flex items-center justify-center">
//                       <span className="text-xs font-bold">Y</span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium flex items-center gap-2">
//                         You{" "}
//                         {isHost && (
//                           <Crown size={12} className="text-amber-400" />
//                         )}
//                       </p>
//                       <p className="text-xs text-white/40 flex items-center gap-1">
//                         <span className="w-2 h-2 rounded-full bg-green-400"></span>
//                         Connected
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     {isMuted && <MicOff size={14} className="text-red-400" />}
//                     {isVideoOff && (
//                       <VideoOff size={14} className="text-red-400" />
//                     )}
//                   </div>
//                 </div>

//                 {remotePeers.map((peer) => (
//                   <div
//                     key={peer.id}
//                     className="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                           peer.isHost
//                             ? "bg-linear-to-br from-amber-500 to-orange-600"
//                             : "bg-white/10"
//                         }`}
//                       >
//                         {peer.isHost ? (
//                           <Crown size={14} />
//                         ) : (
//                           <UserIcon size={14} />
//                         )}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium flex items-center gap-2">
//                           {participantNames[peer.id] || peer.name}
//                           {peer.isHost && (
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
//                       {peer.isMuted && (
//                         <MicOff size={14} className="text-red-400" />
//                       )}
//                       {peer.isVideoOff && (
//                         <VideoOff size={14} className="text-red-400" />
//                       )}
//                       {isHost && !peer.isHost && (
//                         <button
//                           onClick={() => removeParticipant(peer.id)}
//                           className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition"
//                         >
//                           <UserMinus size={14} className="text-red-400" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {showChat && (
//               <div className="h-full flex flex-col">
//                 <div ref={chatContainerRef} className="flex-1 space-y-4 mb-4">
//                   {messages.length === 0 ? (
//                     <div className="text-center py-8">
//                       <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
//                       <p className="text-sm text-white/40">No messages yet</p>
//                       <p className="text-xs text-white/20 mt-1">
//                         Start the conversation
//                       </p>
//                     </div>
//                   ) : (
//                     messages.map((msg) => (
//                       <div key={msg.id} className="flex flex-col">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="text-sm font-medium">
//                             {msg.sender}
//                           </span>
//                           <span className="text-xs text-white/40">
//                             {msg.timestamp.toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </span>
//                         </div>
//                         <p className="text-sm bg-white/5 p-3 rounded-lg">
//                           {msg.text}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 <form onSubmit={sendMessage} className="mt-auto">
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       placeholder={
//                         permissions.chat
//                           ? "Type a message..."
//                           : "Chat is disabled by host"
//                       }
//                       disabled={!permissions.chat}
//                       className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
//                     />
//                     <button
//                       type="submit"
//                       disabled={!permissions.chat}
//                       className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition disabled:opacity-50"
//                     >
//                       <MessageSquare size={18} />
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {savedNotes.length > 0 && (
//               <div className="space-y-3 mb-4">
//                 <p className="text-xs text-white/40">Saved Notes</p>

//                 {savedNotes.map((note) => (
//                   <div
//                     key={note.id}
//                     className="bg-white/10 rounded-xl p-3 relative group"
//                   >
//                     {note.isEditing ? (
//                       <textarea
//                         value={note.text}
//                         onChange={(e) => editSavedNote(note.id, e.target.value)}
//                         className="w-full bg-transparent text-sm text-white resize-none focus:outline-none"
//                       />
//                     ) : (
//                       <p className="text-sm text-white">{note.text}</p>
//                     )}

//                     {/* ACTION BUTTONS */}
//                     <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
//                       <button
//                         onClick={() => toggleEdit(note.id)}
//                         className="p-1 hover:bg-yellow-500/20 rounded"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => deleteSavedNote(note.id)}
//                         className="p-1 hover:bg-red-500/20 rounded"
//                       >
//                         <Trash2 size={14} className="text-red-400" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {showNotes && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs text-white/40">Your private notes</p>
//                   <button
//                     onClick={addNote}
//                     className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg"
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>

//                 {notes.length === 0 && (
//                   <div className="text-center py-8">
//                     <p className="text-sm text-white/40">No notes yet</p>
//                     <button
//                       onClick={addNote}
//                       className="mt-2 text-xs text-cyan-400 hover:underline"
//                     >
//                       Create your first note
//                     </button>
//                   </div>
//                 )}

//                 <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
//                   {notes.map((note) => (
//                     <div
//                       key={note.id}
//                       className="bg-white/5 rounded-lg p-3 group relative"
//                     >
//                       <textarea
//                         value={note.text}
//                         onChange={(e) => updateNote(note.id, e.target.value)}
//                         placeholder="Write your note here..."
//                         rows={3}
//                         className="w-full bg-transparent text-sm text-white placeholder-white/30 resize-y focus:outline-none"
//                       />
//                       <button
//                         onClick={() => deleteNote(note.id)}
//                         className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition"
//                       >
//                         <Trash2 size={14} className="text-red-400" />
//                       </button>
//                     </div>
//                   ))}
//                  <button
//   onClick={saveNotes}
//   disabled={isSaving}
//   className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
// >
//   {isSaving ? "Saving..." : "Save"}
// </button>
//                 </div>

//                 <p className="text-[10px] text-white/20 text-center">
//                   Notes are saved only in this browser session
//                 </p>
//               </div>
//             )}
//           </div>

//           <div className="p-6 border-t border-white/10">
//             <button
//               onClick={copyLink}
//               className="w-full cursor-pointer hover:bg-[#E62064] bg-[#E62064]/90 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
//             >
//               <Copy size={16} /> Copy Invite Link
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

import { getTokenData } from "@/app/content/data";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  UserIcon,
  MicOff,
  VideoOff,
  UserMinus,
  Copy,
  Plus,
  Trash2,
  Edit2,
  Save,
  Loader2,
  Users,
  MessageSquare,
  FileText,
  Paperclip,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFileSharing } from "@/hooks/useFileSharing";

export default function Sidebar({
  room,
  showNotification,
  roomId,
  userId,
  userName,
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
  // console.log("Sidebar Props - remotePeers:", remotePeers);
  // State for managing which note is being edited
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editingGlobalIndex, setEditingGlobalIndex] = useState(null);
  const [editingDocId, setEditingDocId] = useState(null);

  // State for showing/hiding the input form (when + is clicked)
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  // State to track if notes are being saved
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for storing notes from API
  const [apiNotes, setApiNotes] = useState(null);
  const [currentDocId, setCurrentDocId] = useState(null);

  // Fetch notes from API when component mounts or userId/roomId changes
  useEffect(() => {
    if (userId && roomId && showNotes) {
      fetchNotesFromAPI();
    }
  }, [userId, roomId, showNotes]);

  const fetchNotesFromAPI = async () => {
    setIsLoading(true);
    try {
      // Fix: Include both userId and meetingId in the GET request
      const response = await fetch(
        `/api/user/notes?userId=${userId}&meetingId=${roomId}`,
      );
      const data = await response.json();
      // console.log("Fetched notes from API:", data);
      const notesArray = data?.data || [];

      const improveData = notesArray.filter((item) => item.disable === false);

      // console.log("improveData", improveData);
      setApiNotes(improveData);
      console.log("API Notes set in state:", apiNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setApiNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save notes to API (POST) - sending as string
  const saveNotesToAPI = async (noteTexts) => {
    if (!noteTexts || noteTexts.length === 0) return;

    setIsSaving(true);
    try {
      // Convert array to string with newline separation
      const notesString = noteTexts.join("\n");

      const response = await fetch("/api/user/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingId: roomId,
          userId: userId,
          note: notesString, // Send as string instead of array
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Notes saved successfully:", data.data);
        // Refresh notes from API
        await fetchNotesFromAPI();
        return data.data;
      } else {
        console.error("Failed to save notes:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Update a specific note in API (PUT)
  const updateNoteInAPI = async (docId, index, newText) => {
    try {
      // Get current notes, update the specific one, then save as string
      const currentNotes = apiNotes.map((note) => note.text);
      currentNotes[index] = newText;
      const notesString = currentNotes.join("\n");
      console.log("Updating note in API with string:", notesString);
      console.log("Updating note in API with string:", docId, newText);
      const response = await fetch("/api/user/notes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noteId: docId,

          newText: newText, // Send updated string
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Note updated successfully");
        await fetchNotesFromAPI();
        return true;
      } else {
        console.error("Failed to update note:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error updating note:", error);
      return false;
    }
  };

  // Delete a note from API (DELETE)
  const deleteNoteFromAPI = async (docId) => {
    try {
      // Get current notes, remove the specific one, then save as string
      // const currentNotes = apiNotes.map(note => note.text);
      // currentNotes.splice(index, 1);
      // const notesString = currentNotes.join('\n');

      const response = await fetch("/api/user/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noteId: docId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Note deleted successfully");
        await fetchNotesFromAPI();
        return true;
      } else {
        console.error("Failed to delete note:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  };

  // Handle adding a new note
  const handleAddNewNote = async () => {
    if (newNoteText.trim() === "") return;

    const currentNotes = apiNotes.map((note) => note.text);
    const updatedNotes = [...currentNotes, newNoteText.trim()];

    const result = await saveNotesToAPI(updatedNotes);
    if (result) {
      setNewNoteText("");
      setShowNoteInput(false);
    }
  };

  // Handle editing a note
  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    console.log("Editing note:", note);
    setEditText(note.text);
    setEditingGlobalIndex(note.globalIndex);
    setEditingDocId(note.docId);
  };

  // Handle saving edited note
  const handleSaveEdit = async () => {
    if (editText.trim() === "") return;

    const success = await updateNoteInAPI(
      editingDocId,
      editingGlobalIndex,
      editText.trim(),
    );
    if (success) {
      setEditingNoteId(null);
      setEditText("");
      setEditingGlobalIndex(null);
      setEditingDocId(null);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (note) => {
    const success = await deleteNoteFromAPI(note.docId, note.globalIndex);
    if (success) {
      // State will be refreshed by fetchNotesFromAPI
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditText("");
    setEditingGlobalIndex(null);
    setEditingDocId(null);
  };

  // Handle + icon click
  const handlePlusClick = () => {
    setShowNoteInput(true);
  };

  // Handle cancel new note
  const handleCancelNewNote = () => {
    setNewNoteText("");
    setShowNoteInput(false);
  };

  const formatDateTime = (date) => {
    const d = new Date(date);

    const formattedDate = d.toLocaleDateString("en-GB"); // 16/04/2026
    const formattedTime = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // 06:45 PM

    return `${formattedDate} • ${formattedTime}`;
  };

  const hasNotes = apiNotes && apiNotes.length > 0;

  const [showFiles, setShowFiles] = useState(false);

  const { sendFile, uploadProgress, downloadingFile, fileTransfers } =
    useFileSharing(room, showNotification);

  const [activeTab, setActiveTab] = useState("participants");

  const closeSidebar = () => {
    setShowParticipants(false);
    setShowChat(false);
    setShowNotes(false);
    setShowFiles(false);
  };

  return (
    <AnimatePresence>
      {(showParticipants || showChat || showNotes || showFiles) && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="sm:hidden fixed inset-0 z-30 bg-black/45 backdrop-blur-[1px]"
            aria-label="Close sidebar"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed sm:relative top-0 right-0 z-40 h-full w-[88vw] max-w-[360px] sm:w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col"
          >
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowParticipants(true);
                    setShowChat(false);
                    setShowNotes(false);
                    setShowFiles(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    showParticipants
                      ? "bg-gray-400 text-gray-800"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Users size={16} />
                </button>
                <button
                  onClick={() => {
                    setShowChat(true);
                    setShowNotes(false);
                    setShowParticipants(false);
                    setShowFiles(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    showChat
                      ? "bg-gray-400 text-gray-800"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <MessageSquare size={16} />
                </button>

                <button
                  onClick={() => {
                    setShowNotes(true);
                    setShowParticipants(false);
                    setShowChat(false);
                    setShowFiles(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    showNotes
                      ? "bg-gray-400 text-gray-800"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <FileText size={16} />
                </button>

                {/* <button
                  onClick={() => {
                    setShowFiles(true);
                    setShowChat(false);
                    setShowNotes(false);
                    setShowParticipants(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    showFiles ? "bg-gray-400 text-gray-800" : "bg-white/5"
                  }`}
                >
                  <Paperclip size={16} />
                </button> */}
              </div>

              <button
                onClick={closeSidebar}
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

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-white/20">
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
                        {isHost === "host" && (
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
                          peer.isHost === "host"
                            ? "bg-linear-to-br from-amber-500 to-orange-600"
                            : "bg-white/10"
                        }`}
                      >
                        {/* {peer.isHost === "host" ? (
                          <Crown size={14} />
                        ) : (
                          <UserIcon size={14} />
                        )} */}

                        {peer.image ? (
    <img
      src={peer.image}
      alt={peer.name}
      className="w-full h-full object-cover rounded-2xl"
    />
  ) : peer.isHost ? (
    <Crown size={14} />
  ) : (
    <UserIcon size={14} />
  )}
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1">
                          {participantNames[peer.id] || peer.name}
                          {peer.isHost === "host" && (
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
                  {hasNotes && !showNoteInput && !isLoading && (
                    <button
                      onClick={handlePlusClick}
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                  </div>
                )}

                {/* Input field and Save button - shown when + is clicked OR when no notes exist */}
                {!isLoading && (showNoteInput || !hasNotes) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/10 rounded-lg p-4 border border-white/20"
                  >
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write your note here..."
                      rows={3}
                      className="w-full bg-transparent text-sm text-white placeholder-white/30 resize-y focus:outline-none rounded-lg p-2 border border-white/10 focus:border-cyan-500 transition"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleAddNewNote}
                        disabled={!newNoteText.trim() || isSaving}
                        className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Save size={14} />
                        )}
                        Save Note
                      </button>
                      {hasNotes && (
                        <button
                          onClick={handleCancelNewNote}
                          className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Display saved notes as cards */}
                {!isLoading && hasNotes && (
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {apiNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-48 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                      >
                        {editingNoteId === note?._id ? (
                          // Edit mode
                          <div>
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              placeholder="Edit your note..."
                              rows={3}
                              className="w-full bg-white/5 text-sm text-white placeholder-white/30 resize-y focus:outline-none rounded-lg p-2 border border-white/20 focus:border-cyan-500 transition"
                              autoFocus
                            />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={handleSaveEdit}
                                disabled={!editText?.trim() || isSaving}
                                className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1"
                              >
                                {isSaving ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="py-1.5 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <div>
                            <p className="text-xs text-white/90 leading-relaxed whitespace-pre-wrap break-words">
                              {note?.Notes}
                              <div className="flex justify-end -mt-6">
                                <span className="text-[7px] text-white/40">
                                  {formatDateTime(note?.createdAt)}
                                </span>
                              </div>
                            </p>

                            <div className="flex justify-end gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditNote(note)}
                                className="p-1.5 bg-white/10 hover:bg-amber-500/20 rounded-lg transition-all duration-200 hover:scale-105"
                                title="Edit note"
                              >
                                <Edit2 size={8} className="text-amber-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note)}
                                className="p-1.5 bg-white/10 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-105"
                                title="Delete note"
                              >
                                <Trash2 size={8} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* No notes message */}
                {!isLoading && !hasNotes && !showNoteInput && (
                  <div className="text-center py-8">
                    <p className="text-sm text-white/40">No notes yet</p>
                    <button
                      onClick={handlePlusClick}
                      className="mt-2 text-xs text-cyan-400 hover:underline"
                    >
                      Create your first note
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-white/20 text-center">
                  Notes are automatically saved to the cloud
                </p>
              </div>
            )}

            {showFiles && (
              <div className="space-y-4">
                <p className="text-xs text-white/40">Share files</p>

                {/* Upload */}
                <label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    hidden
                    // onChange={(e) => {
                    //   const file = e.target.files[0];
                    //   if (file) sendFile(file);
                    //   console.log("Selected file:", file);
                    // }
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        console.log("Selected file:", file);
                        await sendFile(file);
                        e.target.value = ''; // Reset input
                      }
                    }
                  }
                  />
                  <div className="p-4 bg-white/10 rounded-lg text-center cursor-pointer">
                    Upload File <Paperclip size={16} />
                  </div>
                </label>

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <p className="text-xs text-cyan-400">
                    Uploading: {uploadProgress}%
                  </p>
                )}

                {/* Receiving */}
                {downloadingFile && (
                  <p className="text-xs text-green-400">
                    Receiving: {downloadingFile.name}
                  </p>
                )}

                {/* File list */}
                <div className="space-y-2">
                  {fileTransfers.map((file) => (
                    <div key={file.id} className="p-2 bg-white/5 rounded">
                      <p>{file.name}</p>
                      <span className="text-xs text-white/40">
                        {file.sender}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 border-t border-white/10">
            <button
              onClick={copyLink}
              className="w-full cursor-pointer hover:bg-[#E62064] bg-[#E62064]/90 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <Copy size={16} /> Copy Invite Link
            </button>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
