import { useState, useEffect, useRef } from "react";
import { RoomEvent } from "livekit-client";

export const useChat = (room, permissions, meetingId, userId, userName) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Refs to always have latest userId and userName
  const userIdRef = useRef(userId);
  const userNameRef = useRef(userName);

  useEffect(() => {
    userIdRef.current = userId;
    userNameRef.current = userName;
  }, [userId, userName]);

  // Listen for real-time messages via LiveKit
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload, participant) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload));
        const senderName = participant.name || participant.identity;

        // Ignore reaction messages
        if (message.type === "reaction") return;

        if (message.type === "editMessage") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === message.messageId
                ? { ...msg, text: message.newText }
                : msg,
            ),
          );
          return;
        }
        
        // Handle deleted messages
        if (message.type === "deleteMessage") {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== message.messageId),
          );
          return;
        }

        // Check for duplicate (avoid adding same message twice)
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) =>
              msg.text === message.text &&
              msg.sender === senderName &&
              Date.now() - msg.timestamp.getTime() < 2000,
          );

          if (isDuplicate) return prev;

          return [
            ...prev,
            {
              id: `live-${Date.now()}-${Math.random()}`,
              text: message.text,
              sender: senderName,
              senderId: message.senderId,
              timestamp: new Date(),
            },
          ];
        });
      } catch (e) {
        console.error("Failed to parse chat message", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  // Load chat history from API
  useEffect(() => {
    if (!meetingId) return;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await fetch(`/api/user/messages?meetingId=${meetingId}`);
        const data = await res.json();

        if (data.messages) {
          const formatted = data.messages
            .filter((msg) => !msg.disable)
            .map((msg) => ({
              id: msg._id,
              text: msg.content,
              sender: msg.senderName,
              senderId: msg.senderId, // ← ADD THIS
              timestamp: new Date(msg.createdAt),
            }))
            .reverse();
          setMessages(formatted);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [meetingId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message
  const sendMessage = async (e, showNotification) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    if (!permissions.chat) {
      showNotification("Chat is disabled by host", "error");
      return;
    }

    const currentUserId = userIdRef.current;
    const currentUserName = userNameRef.current;
    const messageText = newMessage;

    // Clear input immediately
    setNewMessage("");

    // Add message to UI immediately with temp ID
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        text: messageText,
        sender: currentUserName || "You",
        senderId: currentUserId, // ← ADD THIS
        timestamp: new Date(),
      },
    ]);

    // 1. Send via LiveKit (real-time)
    const messageData = { text: messageText, senderId: currentUserId };
    const encoder = new TextEncoder();
    const payload = encoder.encode(JSON.stringify(messageData));

    try {
      await room.localParticipant.publishData(payload);
    } catch (error) {
      console.error("LiveKit send failed:", error);
    }

    // 2. Save to database via API
    if (currentUserId && currentUserName && meetingId) {
      try {
        const formData = new FormData();
        formData.append("meetingId", meetingId);
        formData.append("senderId", currentUserId);
        formData.append("senderName", currentUserName);
        formData.append("content", messageText);

        const res = await fetch("/api/user/messages", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log("API Response:", data);

        // Replace temp ID with real database ID
        if (res.ok && data.message?._id) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, id: data.message._id } : msg,
            ),
          );
        }

        showNotification("Message sent", "success");
      } catch (error) {
        console.error("API call failed:", error);
        showNotification("Message sent (not saved)", "error");
      }
    } else {
      console.warn("User data not loaded, message not saved to DB");
      showNotification("Message sent", "success");
    }
  };

  const deleteMessage = async (messageId, showNotification) => {
    // 1. Save to API
    try {
      await fetch(`/api/user/messages?messageId=${messageId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("API delete failed:", error);
    }

    // 2. Broadcast delete to all participants
    if (room && room.localParticipant) {
      const deleteData = {
        type: "deleteMessage",
        messageId: messageId,
      };
      const encoder = new TextEncoder();
      const payload = encoder.encode(JSON.stringify(deleteData));
      await room.localParticipant.publishData(payload, { reliable: true });
    }

    // 3. Remove from local state
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    showNotification("Message deleted", "success");
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    chatContainerRef,
    sendMessage,
    isLoadingHistory,
    deleteMessage,
    setMessages,
  };
};

// import { useState, useEffect, useRef } from "react";
// import { RoomEvent } from "livekit-client";

// export const useChat = (room, permissions) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     if (!room) return;

//     const handleDataReceived = (payload, participant) => {
//       console.log("working..");
//       console.log("Data received from", participant.name, ":", payload);
//       try {
//         const message = JSON.parse(new TextDecoder().decode(payload));
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now(),
//             text: message.text,
//             sender: participant.name,
//             timestamp: new Date(),
//           },
//         ]);
//       } catch (e) {
//         console.error("Failed to parse chat message", e);
//       }
//     };

//     room.on(RoomEvent.DataReceived, handleDataReceived);
//     return () => {
//       room.off(RoomEvent.DataReceived, handleDataReceived);
//     };
//   }, [room]);

//   // Scroll chat to bottom
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const sendMessage = async (e, showNotification) => {
//     e.preventDefault();
//     if (newMessage.trim() && permissions.chat) {
//       const messageData = { text: newMessage };
//       const encoder = new TextEncoder();
//       const payload = encoder.encode(JSON.stringify(messageData));
//       await room.localParticipant.publishData(payload);
//       setMessages((prev) => [
//         ...prev,
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

//   return {
//     messages,
//     newMessage,
//     setNewMessage,
//     chatContainerRef,
//     sendMessage,
//   };
// };
