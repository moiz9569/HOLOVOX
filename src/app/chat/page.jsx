"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Send,
  Hash,
  Smile,
  Paperclip,
  Search,
  ChevronDown,
  MoreHorizontal,
  Bell,
  MessageSquare,
  ArrowLeft,
  CircleAlert,
  X,
  FileText,
  PlaySquare,
  Users,
  Check,
  X as XIcon,
} from "lucide-react";
import { getTokenData } from "@/app/content/data";
import { showSuccessToast, showErrorToast } from "../../../lib/toast";

const getStatusStyles = (status) => {
  switch (status) {
    case "accepted":
      return "bg-green-50 text-green-600 border-green-200";
    case "rejected":
      return "bg-red-50 text-red-600 border-red-200";
    case "pending":
      return "bg-amber-50 text-amber-600 border-amber-200";
    default:
      return "";
  }
};

// Helper to handle unpopulated Mongoose references without crashing
const resolveUser = (userRef) => {
  if (!userRef) return { _id: "unknown", name: "Unknown" };
  if (typeof userRef === "string") return { _id: userRef, name: `User ${userRef.substring(0, 4)}` };
  if (!userRef.name) return { _id: userRef._id || userRef, name: `User ${(userRef._id || "unknown").toString().substring(0, 4)}` };
  return userRef;
};

export default function ChatUI() {
  const [activeTab, setActiveTab] = useState("chats");
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [draftMessage, setDraftMessage] = useState("");
  
  // Real data states
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [messages, setMessages] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newRequestTargetId, setNewRequestTargetId] = useState(""); // For sending new POST requests
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getTokenData();
        console.log("Fetched user data:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        showErrorToast("Failed to load user data");
      }
    };
    fetchUser();
  }, []);

  // Defined fetchRequests for GET API integration
  const fetchRequests = async (userData) => {
    try {
      setLoading(true);
      if (!userData?.id) {
        console.warn("User ID not available");
        setRequests([]);
        setAcceptedConnections([]);
        return;
      }
      
      // Fixed URL string: Changed '&&' to '&' so the backend param extraction works
      const endpoint = `/api/user/request?userId=${userData.id}&role=${userData.role}`;
      console.log("Fetching requests from:", endpoint);
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      console.log("Requests response:", data, "Status:", response.status);
      
      if (response.ok && Array.isArray(data)) {
        setRequests(data);
        const accepted = data.filter(req => req.status === "accepted");
        setAcceptedConnections(accepted);
      } else {
        console.warn("Requests response not ok or not array");
        setRequests([]);
        setAcceptedConnections([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
      setAcceptedConnections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      console.log("User loaded:", user);
      fetchRequests(user);
    }
  }, [user]);

  // Integrated POST API to send connection requests
  const handleSendRequest = async () => {
    if (!newRequestTargetId.trim()) return;
    try {
      const response = await fetch("/api/user/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: newRequestTargetId.trim(),
          role: user.role
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && !data.message) {
        showSuccessToast("Request sent successfully");
        setNewRequestTargetId("");
        if (user) fetchRequests(user);
      } else {
        // Handle backend's "Request already sent" block
        showErrorToast(data.message || data.error || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      showErrorToast("Failed to send request");
    }
  };

  // Integrated PUT API to accept/reject
  const handleAcceptReject = async (requestId, status) => {
    try {
      const response = await fetch("/api/user/request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      if (response.ok) {
        showSuccessToast(`Request ${status}`);
        if (user) fetchRequests(user);
      } else {
        showErrorToast("Failed to update request");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      showErrorToast("Failed to update request");
    }
  };

  const fetchMessages = async (connection) => {
    try {
      setLoadingMessages(true);
      const response = await fetch(
        `/api/user/request/messages?senderId=${connection.sender}&receiverId=${connection.receiver}`
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(prev => ({
          ...prev,
          [connection._id]: data
        }));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeChat || (!draftMessage.trim() && !pendingAttachment)) return;
    try {
      const formData = new FormData();
      formData.append("senderId", user.id);
      formData.append("receiverId", activeChat.otherUserId);
      if (draftMessage.trim()) formData.append("text", draftMessage.trim());
      if (pendingAttachment) formData.append("file", pendingAttachment.file);
      
      const response = await fetch("/api/user/request/messages", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const newMessage = await response.json();
        setMessages(prev => ({
          ...prev,
          [activeChat._id]: [...(prev[activeChat._id] || []), newMessage.message]
        }));
        setDraftMessage("");
        setPendingAttachment(null);
      } else {
        showErrorToast("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showErrorToast("Failed to send message");
    }
  };

  const currentMessages = useMemo(() => {
    if (!activeChat) return [];
    return messages[activeChat._id] || [];
  }, [activeChat, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const filteredRequests = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    return requests.filter(req => {
      const s = resolveUser(req.sender);
      const r = resolveUser(req.receiver);
      return s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             r.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [requests, searchQuery]);

  const filteredConnections = useMemo(() => {
    if (!Array.isArray(acceptedConnections)) return [];
    return acceptedConnections.filter(conn => {
      const s = resolveUser(conn.sender);
      const r = resolveUser(conn.receiver);
      return s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             r.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [acceptedConnections, searchQuery]);

  const showEmptyState = !activeChat || currentMessages.length === 0;

  const handleAttachmentClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      setPendingAttachment({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        type: isImage ? "image" : isVideo ? "video" : "file",
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      });
    }
    if (e.target) e.target.value = null;
  };

  const removeAttachment = () => {
    if (pendingAttachment?.url) URL.revokeObjectURL(pendingAttachment.url);
    setPendingAttachment(null);
  };

  useEffect(() => {
    return () => {
      if (pendingAttachment?.url) URL.revokeObjectURL(pendingAttachment.url);
    };
  }, [pendingAttachment]);

  return (
    <div className="h-full min-h-0 bg-white md:bg-transparent">
      <div className="h-full min-h-0 md:rounded-2xl md:shadow-sm md:border border-gray-100 overflow-hidden flex bg-white">
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex-col bg-white transition-all duration-300 ${
            activeChat ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Messages</h1>
              <MoreHorizontal size={20} className="text-gray-400 cursor-pointer hover:text-gray-600 transition" />
            </div>
            <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
              <button
                onClick={() => setActiveTab("chats")}
                className={`flex-1 flex justify-center items-center gap-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  activeTab === "chats"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <MessageSquare size={14} /> Chats
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex-1 flex justify-center items-center gap-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  activeTab === "notifications"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Bell size={14} />
                <span className="hidden sm:inline">Requests</span>
                {Array.isArray(requests) && requests.filter((r) => r.status === "pending").length > 0 && (
                  <span className="bg-[#E51A54] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                    {requests.filter((r) => r.status === "pending").length}
                  </span>
                )}
              </button>
            </div>
            
            {(activeTab === "chats" || activeTab === "notifications") && (
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E51A54] transition-colors"
                />
                <input
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E51A54] transition-all text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {loading ? (
              <div className="py-10 text-center text-sm text-gray-500">Loading...</div>
            ) : activeTab === "chats" ? (
              <div className="space-y-2">
                {filteredConnections.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    No accepted connections yet
                  </div>
                ) : (
                  filteredConnections.map((connection) => {
                    const isSender = connection.sender === user.id || connection.sender?._id === user.id;
                    const otherUser = resolveUser(isSender ? connection.receiver : connection.sender);
                    const lastMessage = messages[connection._id]?.slice(-1)[0];
                    const isActive = activeChat?._id === connection._id;
                    
                    return (
                      <button
                        key={connection._id}
                        onClick={() => {
                          setActiveChat({
                            _id: connection._id,
                            name: otherUser.name,
                            otherUserId: otherUser._id,
                            image: otherUser.image
                          });
                          if (!messages[connection._id]) {
                            fetchMessages(connection);
                          }
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition ${
                          isActive ? "bg-red-50 border-red-100" : "bg-white border-transparent hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={otherUser.image || "https://via.placeholder.com/40x40?text=U"}
                            alt={otherUser.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-800 truncate">{otherUser.name}</p>
                              <span className="text-[10px] text-gray-400 shrink-0">
                                {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {lastMessage ? (lastMessage.text || "Attachment") : "Start chatting"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            ) : activeTab === "notifications" ? (
              <div className="space-y-3">
                {/* Integration for POST API: Regular users can send requests */}
                {user && !["doctor", "lawyer"].includes(user.role) && (
                  <div className="flex gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <input
                      type="text"
                      placeholder="Enter Provider ID to connect"
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E51A54] focus:ring-1 focus:ring-[#E51A54]"
                      value={newRequestTargetId}
                      onChange={(e) => setNewRequestTargetId(e.target.value)}
                    />
                    <button
                      onClick={handleSendRequest}
                      disabled={!newRequestTargetId.trim()}
                      className="bg-[#E51A54] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition"
                    >
                      Connect
                    </button>
                  </div>
                )}

                {filteredRequests.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    <p className="font-medium mb-2">
                      {loading ? "Loading requests..." : ["doctor", "lawyer"].includes(user?.role) ? "No incoming requests" : "No sent requests"}
                    </p>
                    {!loading && user && (
                      <p className="text-xs text-gray-400 mt-2">
                        You are logged in as: <span className="font-semibold">{user.name || user.email}</span><br/>
                        Role: <span className="font-semibold">{user.role || "Not specified"}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredRequests.map((request) => {
                      const isProvider = ["doctor", "lawyer"].includes(user?.role);
                      const otherUser = resolveUser(isProvider ? request.sender : request.receiver);
                      const isPending = request.status === "pending";

                      if (!otherUser) return null;

                      return (
                        <div
                          key={request._id}
                          className={`p-3 rounded-xl border ${
                            request.status === "accepted" ? "bg-green-50/50 border-green-100" :
                            request.status === "rejected" ? "bg-red-50/50 border-red-100" :
                            "bg-white border-transparent"
                          } hover:bg-gray-50 transition`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={otherUser.image || "https://via.placeholder.com/40x40?text=U"}
                              alt={otherUser.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className={`text-sm ${request.status === "pending" ? "text-gray-800 font-semibold" : "text-gray-600"}`}>
                                {isProvider
                                  ? `${otherUser.name} requested to connect`
                                  : `Request to ${otherUser.name}`
                                }
                              </p>
                              <div className="flex items-center justify-between mt-1.5">
                                <p className="text-xs text-gray-400">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${getStatusStyles(request.status)}`}
                                  >
                                    {request.status}
                                  </span>
                                  {isProvider && isPending && (
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => handleAcceptReject(request._id, "accepted")}
                                        className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                                      >
                                        <Check size={12} />
                                      </button>
                                      <button
                                        onClick={() => handleAcceptReject(request._id, "rejected")}
                                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                      >
                                        <XIcon size={12} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className={`flex-1 min-h-0 flex-col bg-[#F8F9FB] ${activeChat ? "flex" : "hidden md:flex"}`}>
          {activeChat ? (
            <>
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveChat(null)}
                    className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <img
                    src={activeChat.image || "https://via.placeholder.com/40x40?text=U"}
                    alt={activeChat.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-bold text-gray-800 text-base sm:text-lg">
                      {activeChat.name}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      Private chat
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 custom-scrollbar">
                {showEmptyState ? (
                  <div className="flex flex-col items-center justify-center h-full text-center fade-in">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare size={32} className="text-[#E51A54] opacity-50" />
                    </div>
                    <p className="text-gray-600 text-lg font-bold">Start the conversation</p>
                    <p className="text-gray-400 text-sm mt-1 max-w-xs">
                      Send a message to kick things off in {activeChat.name}.
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg, idx) => {
                    const isMe = msg.sender.toString() === user.id;
                    const showAvatar = idx === 0 || currentMessages[idx - 1]?.sender !== msg.sender;
                    return (
                      <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"} group`}>
                        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[88%] sm:max-w-[75%]`}>
                          {showAvatar && !isMe && (
                            <span className="text-xs font-semibold text-gray-500 mb-1 ml-1">
                              {activeChat.name}
                            </span>
                          )}
                          <div
                            className={`p-1.5 rounded-2xl shadow-sm text-sm ${
                              isMe
                                ? "bg-[#E51A54] text-white rounded-tr-sm"
                                : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm"
                            }`}
                          >
                            {msg.fileUrl && (
                              <div className="mb-2">
                                {msg.fileType === "image" ? (
                                  <img
                                    src={msg.fileUrl}
                                    alt="attachment"
                                    className="max-w-[240px] sm:max-w-xs rounded-xl object-cover border border-black/5"
                                  />
                                ) : (
                                  <a
                                    href={msg.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                  >
                                    <FileText size={16} />
                                    <span className="text-xs truncate">{msg.fileUrl.split('/').pop()}</span>
                                  </a>
                                )}
                              </div>
                            )}
                            {msg.text && (
                              <p className={`px-3 py-1.5 ${msg.fileUrl ? "mt-1" : ""}`}>{msg.text}</p>
                            )}
                          </div>
                          <span
                            className={`text-[10px] mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity ${
                              isMe ? "text-gray-400 mr-1" : "text-gray-400 ml-1"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto bg-[#F8F9FB] border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-red-100 focus-within:border-[#E51A54] transition-all flex flex-col">
                  {pendingAttachment && (
                    <div className="relative inline-flex items-center gap-3 p-2 mb-2 bg-white rounded-xl border border-gray-200 shadow-sm self-start animate-fade-in max-w-[90%]">
                      {pendingAttachment.type === "image" ? (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={pendingAttachment.url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-red-50 text-[#E51A54] flex items-center justify-center flex-shrink-0">
                          {pendingAttachment.type === "video" ? <PlaySquare size={24} /> : <FileText size={24} />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-sm font-medium text-gray-700 truncate">{pendingAttachment.name}</p>
                        <p className="text-xs text-gray-400">{pendingAttachment.size}</p>
                      </div>
                      <button
                        onClick={removeAttachment}
                        className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-500 hover:text-red-500 rounded-full p-1 shadow-sm transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <div>
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <button
                        onClick={handleAttachmentClick}
                        className="p-2 text-gray-400 hover:text-[#E51A54] transition"
                        title="Attach file"
                      >
                        <Paperclip size={20} />
                      </button>
                    </div>
                    <textarea
                      placeholder={`Message ${activeChat.name}...`}
                      className="flex-1 max-h-32 min-h-[40px] bg-transparent outline-none text-sm text-gray-700 resize-none py-2.5 custom-scrollbar"
                      rows={1}
                      value={draftMessage}
                      onChange={(e) => setDraftMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button className="p-2 text-gray-400 hover:text-[#E51A54] transition mb-0.5">
                      <Smile size={20} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="p-2.5 rounded-xl transition-all shadow-md mb-0.5 bg-[#E51A54] text-white hover:bg-[#D4184C] active:scale-95 shadow-red-200"
                    >
                      <Send size={18} className="ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center bg-gray-50">
              <div className="w-32 h-32 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 relative">
                <img
                  src="/new_chat.png"
                  alt="Select chat"
                  className="w-16 h-16 opacity-40 object-contain"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <MessageSquare size={40} className="text-gray-300 absolute" />
              </div>
              <h2 className="text-xl font-bold text-gray-700">Your Messages</h2>
              <p className="text-gray-500 mt-2 text-sm max-w-sm">
                Select a connection from the sidebar to start collaborating.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}