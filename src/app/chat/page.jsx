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
} from "lucide-react";

const initialChatData = {
  channels: [
    { id: 1, name: "BawdicSoft Ltd", type: "channel" },
    { id: 2, name: "Design Team", type: "channel" },
  ],
  users: [
    { id: 1, name: "Samee", avatar: "S", type: "user", status: "online" },
    { id: 2, name: "Moiz Shah", avatar: "M", type: "user", status: "online" },
    { id: 3, name: "Talha", avatar: "T", type: "user", status: "online" },
    { id: 4, name: "Emad", avatar: "E", type: "user", status: "offline" },
  ],
  messages: {
    "channel-1": [
      { id: 1, sender: "Moiz", text: "hi", time: "2:09 PM", align: "left" },
      { id: 2, sender: "Sami", text: "How is it going!", time: "2:09 PM", align: "left" },
      {
        id: 3,
        sender: "You",
        text: "Take a look at the new dashboard mockups. What do you think?",
        time: "2:10 PM",
        align: "right",
      },
      {
        id: 4,
        sender: "You",
        text: "",
        time: "2:11 PM",
        align: "right",
        media: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400&q=80",
      },
    ],
    "user-1": [
      {
        id: 1,
        sender: "Samee",
        text: "Bro did you push the frontend updates?",
        time: "12:10 PM",
        align: "left",
      },
      {
        id: 2,
        sender: "You",
        text: "Yes, check the dashboard branch.",
        time: "12:11 PM",
        align: "right",
      },
    ],
  },
  notifications: [
    { id: 1, text: "Moiz mentioned you in Design Team", time: "10 mins ago", read: false },
    { id: 2, text: "System update scheduled for 3 AM", time: "1 hour ago", read: true },
    { id: 3, text: "Talha uploaded a new file", time: "2 hours ago", read: true },
    {
      id: 4,
      text: "Emad requested access to Figma Dashboard",
      time: "3 hours ago",
      read: false,
      type: "request",
      status: "pending",
    },
    {
      id: 5,
      text: "Annual leave request (Dec 24-26)",
      time: "1 day ago",
      read: true,
      type: "request",
      status: "accepted",
    },
    {
      id: 6,
      text: "Hardware upgrade request (MacBook Pro)",
      time: "2 days ago",
      read: true,
      type: "request",
      status: "rejected",
    },
  ],
};

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

export default function ChatUI() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [activeChat, setActiveChat] = useState(null);
  const [showChannels, setShowChannels] = useState(true);
  const [showDMs, setShowDMs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatData, setChatData] = useState(initialChatData);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [draftMessage, setDraftMessage] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const messages = useMemo(() => {
    if (!activeChat) return [];
    const key = `${activeChat.type}-${activeChat.id}`;
    return chatData.messages[key] || [];
  }, [activeChat, chatData.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredChannels = useMemo(() => {
    return chatData.channels.filter((ch) =>
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, chatData.channels]);

  const filteredUsers = useMemo(() => {
    return chatData.users.filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, chatData.users]);

  const recentChats = useMemo(() => {
    const channelThreads = chatData.channels.map((channel) => {
      const key = `channel-${channel.id}`;
      const threadMessages = chatData.messages[key] || [];
      const lastMessage = threadMessages[threadMessages.length - 1];
      return {
        id: channel.id,
        type: "channel",
        name: channel.name,
        avatar: "#",
        status: "group",
        time: lastMessage?.time || "",
        preview: lastMessage?.text || (lastMessage?.media ? "Sent an attachment" : "No messages yet"),
      };
    });

    const userThreads = chatData.users.map((user) => {
      const key = `user-${user.id}`;
      const threadMessages = chatData.messages[key] || [];
      const lastMessage = threadMessages[threadMessages.length - 1];
      return {
        id: user.id,
        type: "user",
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        time: lastMessage?.time || "",
        preview: lastMessage?.text || (lastMessage?.media ? "Sent an attachment" : "Start a conversation"),
      };
    });

    return [...channelThreads, ...userThreads]
      .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => Number(Boolean(b.time)) - Number(Boolean(a.time)));
  }, [chatData.channels, chatData.messages, chatData.users, searchQuery]);

  const showEmptyState = !activeChat || messages.length === 0;

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

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

  const handleSendMessage = () => {
    if (!activeChat || (!draftMessage.trim() && !pendingAttachment)) return;

    const key = `${activeChat.type}-${activeChat.id}`;
    const existing = chatData.messages[key] || [];
    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: draftMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      align: "right",
      media: pendingAttachment?.type === "image" ? pendingAttachment.url : undefined,
    };

    setChatData((prev) => ({
      ...prev,
      messages: {
        ...prev.messages,
        [key]: [...existing, newMessage],
      },
    }));

    setDraftMessage("");
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
              <MoreHorizontal
                size={20}
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition"
              />
            </div>

            <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 flex justify-center items-center gap-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  activeTab === "chat"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users size={14} /> Chat
              </button>
              <button
                onClick={() => setActiveTab("inbox")}
                className={`flex-1 flex justify-center items-center gap-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  activeTab === "inbox"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <MessageSquare size={14} /> Inbox
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
                <span className="hidden sm:inline">Notifications</span>
                <span className="bg-[#E51A54] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                  {chatData.notifications.filter((n) => !n.read).length}
                </span>
              </button>
            </div>

            {(activeTab === "inbox" || activeTab === "chat") && (
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E51A54] transition-colors"
                />
                <input
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E51A54] transition-all text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {activeTab === "chat" ? (
              <div className="space-y-2">
                {recentChats.map((thread) => {
                  const isActive = activeChat?.id === thread.id && activeChat?.type === thread.type;
                  return (
                    <button
                      key={`${thread.type}-${thread.id}`}
                      onClick={() => setActiveChat({ id: thread.id, type: thread.type, name: thread.name })}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        isActive
                          ? "bg-red-50 border-red-100"
                          : "bg-white border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                            thread.type === "channel"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {thread.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-800 truncate">{thread.name}</p>
                            <span className="text-[10px] text-gray-400 shrink-0">{thread.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{thread.preview}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : activeTab === "inbox" ? (
              <div className="space-y-6">
                <div>
                  <button
                    onClick={() => setShowChannels(!showChannels)}
                    className="flex items-center justify-between w-full text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 hover:text-gray-600 transition"
                  >
                    Channels
                    <ChevronDown
                      size={14}
                      className={`${showChannels ? "" : "-rotate-90"} transition-transform`}
                    />
                  </button>
                  {showChannels && (
                    <div className="space-y-0.5">
                      {filteredChannels.map((ch) => (
                        <div
                          key={ch.id}
                          onClick={() => setActiveChat({ ...ch, type: "channel" })}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                            activeChat?.id === ch.id && activeChat?.type === "channel"
                              ? "bg-red-50 text-[#E51A54]"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <Hash
                            className={
                              activeChat?.id === ch.id && activeChat?.type === "channel"
                                ? "text-[#E51A54]"
                                : "text-gray-400"
                            }
                            size={18}
                          />
                          <span className="text-sm font-medium">{ch.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setShowDMs(!showDMs)}
                    className="flex items-center justify-between w-full text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 hover:text-gray-600 transition"
                  >
                    Direct Messages
                    <ChevronDown
                      size={14}
                      className={`${showDMs ? "" : "-rotate-90"} transition-transform`}
                    />
                  </button>
                  {showDMs && (
                    <div className="space-y-0.5">
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => setActiveChat({ ...u, type: "user" })}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                            activeChat?.id === u.id && activeChat?.type === "user"
                              ? "bg-red-50 text-[#E51A54]"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <div className="relative">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                                activeChat?.id === u.id && activeChat?.type === "user"
                                  ? "bg-[#E51A54] text-white"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {u.avatar}
                            </div>
                            {u.status === "online" && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{u.name}</p>
                            <p className="text-xs text-gray-400 truncate">
                              {u.status === "online" ? "Active now" : "Offline"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {chatData.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border ${
                      notif.read ? "bg-white border-transparent" : "bg-red-50/50 border-red-100"
                    } hover:bg-gray-50 transition cursor-pointer flex gap-3`}
                  >
                    <div className={`mt-0.5 ${notif.read ? "text-gray-400" : "text-[#E51A54]"}`}>
                      <CircleAlert size={18} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${notif.read ? "text-gray-600" : "text-gray-800 font-semibold"}`}>
                        {notif.text}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-gray-400">{notif.time}</p>
                        {notif.type === "request" && notif.status && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${getStatusStyles(notif.status)}`}
                          >
                            {notif.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  <div>
                    <h2 className="font-bold text-gray-800 text-base sm:text-lg flex items-center gap-2">
                      {activeChat.type === "channel" && <Hash size={18} className="text-gray-400" />}
                      {activeChat.name}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      {activeChat.type === "user"
                        ? chatData.users.find((u) => u.id === activeChat.id)?.status === "online"
                          ? "Online"
                          : "Offline"
                        : "Channel - 4 members"}
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
                  messages.map((msg, idx) => {
                    const isMe = msg.align === "right";
                    const showAvatar = idx === 0 || messages[idx - 1]?.sender !== msg.sender;

                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} group`}>
                        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[88%] sm:max-w-[75%]`}>
                          {showAvatar && !isMe && (
                            <span className="text-xs font-semibold text-gray-500 mb-1 ml-1">
                              {msg.sender}
                            </span>
                          )}

                          <div
                            className={`p-1.5 rounded-2xl shadow-sm text-sm ${
                              isMe
                                ? "bg-[#E51A54] text-white rounded-tr-sm"
                                : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm"
                            }`}
                          >
                            {msg.media && (
                              <img
                                src={msg.media}
                                alt="attachment"
                                className="max-w-[240px] sm:max-w-xs rounded-xl object-cover border border-black/5"
                              />
                            )}

                            {msg.text && (
                              <p className={`px-3 py-1.5 ${msg.media ? "mt-1" : ""}`}>{msg.text}</p>
                            )}
                          </div>

                          <span
                            className={`text-[10px] mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity ${
                              isMe ? "text-gray-400 mr-1" : "text-gray-400 ml-1"
                            }`}
                          >
                            {msg.time}
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
                          {pendingAttachment.type === "video" ? (
                            <PlaySquare size={24} />
                          ) : (
                            <FileText size={24} />
                          )}
                        </div>
                      )}

                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {pendingAttachment.name}
                        </p>
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
                Select a channel or direct message from the sidebar to start collaborating with your
                team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
